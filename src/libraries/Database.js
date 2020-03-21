import SQLite from 'react-native-sqlite-storage'
// import { DEBUG } from '../configs'
import { wait } from '../common/utils/async'

SQLite.DEBUG(false)
SQLite.enablePromise(true)

const SCHEMES = {
  logs: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    timestamp: 'INTEGER',
    data: 'TEXT',
    module: 'TEXT'
  }
}

class Database {
  constructor () {
    this.NAME = 'encrypted'
    this.VERSION = '1.0'
    this.DISPLAY_NAME = 'encrypted'
    this.DATABASE_SIZE = 2000000

    this.database = null
  }

  createTables () {
    return new Promise((resolve, reject) => {
      this.database.transaction(async (transaction) => {
        return Promise.all(
          Object.keys(SCHEMES).map(key => {
            const scheme = SCHEMES[key]
            const data = Object.keys(scheme).map(item => {
              return `"${item}" ${scheme[item]}`
            })
            return transaction.executeSql(`CREATE TABLE IF NOT EXISTS ${key} (${data.join(',')})`, [])
          })
        )
          .then(() => {
            resolve(true)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
  }

  parseInsertQuery (table, params, valueOnly = false, options = {}) {
    const values = []
    const scheme = SCHEMES[table]
    const fields = Object.keys(params).map(key => {
      if (scheme[key]) {
        values.push(params[key])
        return `"${key}"`
      }
      return null
    }).filter(item => item)
    if (!fields.length) {
      throw new Error('MISSING_FIELD')
    }

    let query = ''
    if (valueOnly) {
      query = `(${values.map(item => '?').join(',')})`
    } else {
      if (options.insertIgnore) {
        query = `INSERT OR IGNORE INTO ${table} (${fields.join(',')}) VALUES(${values.map(item => '?').join(',')})`
      } else {
        query = `INSERT INTO ${table} (${fields.join(',')}) VALUES(${values.map(item => '?').join(',')})`
      }
    }

    return { query, values }
  }

  parseSelectQuery (table, params) {
    const { where = [], orders = [], limit, groups = [], offset } = params
    let query = `SELECT * FROM ${table}`
    const values = []
    const conditions = where.map(item => {
      const field = item[0]
      let condition = '='
      if (item.length === 3) {
        condition = item[1]
        values.push(item[2])
      } else {
        values.push(item[1])
      }

      return ` "${field}" ${condition} ? `
    })
    const orderBy = orders.map(item => {
      let type = 'DESC'
      if (item.length === 2) {
        type = item[1]
      }

      return ` "${item[0]}" ${type} `
    })

    if (conditions.length) {
      query += ` WHERE ${conditions.join('&')} `
    }
    if (orderBy.length) {
      query += ` ORDER BY ${orderBy.join(',')} `
    }
    if (groups.length) {
      query += ` GROUP BY ${groups.join(',')} `
    }
    if (limit) {
      query += ` LIMIT ${limit} `
    }
    if (offset !== undefined) {
      query += ` OFFSET ${offset} `
    }
    return { query, values }
  }

  parseDeleteQuery (table, params) {
    const { where = [] } = params
    let query = `DELETE FROM ${table}`
    let values = []
    const conditions = where.map(item => {
      const field = item[0]
      let condition = '='
      let value = ''
      if (item.length === 3) {
        condition = item[1]
        value = item[2]
      } else {
        value = item[1]
      }

      switch (condition) {
        case 'in':
          values = [...values, ...value]
          return ` "${field}" ${condition} (${Array(value.length).fill('?').join(',')}) `
        default:
          values.push(value)
          return ` "${field}" ${condition} ? `
      }
    })

    if (conditions.length) {
      query += ` WHERE ${conditions.join('&')} `
    }

    return { query, values }
  }

  parseBulkInsert (table, items, options = {}) {
    let parameters = []
    let txKeys = []
    let allQuery = ''
    let count = 0
    const queries = []
    items.forEach((item, index) => {
      const result = this.parseInsertQuery(table, item, count !== 0, options)
      allQuery += result.query
      parameters = [...parameters, ...result.values]
      txKeys.push(item.txKey)
      count++
      if (count > 40) {
        queries.push({ query: `${allQuery};`, params: parameters, txKeys })
        parameters = []
        txKeys = []
        allQuery = ''
        count = 0
      } else {
        allQuery += ','
      }
    })
    if (count > 0) {
      queries.push({ query: `${allQuery.slice(0, -1)};`, params: parameters, txKeys })
    }
    return queries
  }

  model (table) {
    return {
      insert: (params) => {
        const { query, values } = this.parseInsertQuery(table, params)
        return this.query(`${query};`, values)
      },
      bulkInsert: (items, options = {}) => {
        const queries = this.parseBulkInsert(table, items, options)
        return this.transactionAll(queries, options)
      },
      get: (params = {}) => {
        const { query, values } = this.parseSelectQuery(table, params)
        return this.query(`${query};`, values)
      },
      delete: (params = {}) => {
        const { query, values } = this.parseDeleteQuery(table, params)
        return this.query(`${query};`, values)
      }
    }
  }

  table (name) {
    if (!name || !SCHEMES[name]) {
      throw new Error('INVALID_TABLE')
    }
    return {
      ...this.model(name)
    }
  }

  async query (sql, params) {
    if (this.process) {
      await this.process
    }
    return this.database.executeSql(sql, params)
  }

  transactionAll (queries, options) {
    return new Promise((resolve, reject) => {
      this.database.transaction(async (transaction) => {
        try {
          const results = await Promise.all(
            queries.map(async item => {
              if (typeof options.beforeQuery === 'function') {
                await options.beforeQuery(item, transaction)
                await wait(200)
              }
              const results = await transaction.executeSql(item.query, item.params)
              return results
            })
          )
          resolve(results)
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  transaction (queries) {
    return new Promise((resolve, reject) => {
      this.database.transaction(async (transaction) => {
        try {
          let i = 0
          const length = queries.length
          const results = []
          for (i = 0; i < length; i++) {
            const item = queries[i]
            const result = await transaction.executeSql(item.query, item.params)
            results.push(result)
          }
          resolve(results)
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  processInit () {
    this.process = new Promise((resolve) => {
      SQLite.echoTest()
        .then(() => {
          SQLite.openDatabase(
            this.NAME,
            this.VERSION,
            this.DISPLAY_NAME,
            this.DATABASE_SIZE
          )
            .then(async instance => {
              console.info('[DATABASE] Open')
              this.database = instance
              delete this.process
              await this.createTables()
              resolve(this.database)
            })
            .catch(error => {
              delete this.process
              console.debug('[DATABASE] openDatabase', error)
              resolve(error)
            })
        })
        .catch(error => {
          delete this.process
          console.debug('[DATABASE] processInit', error)
          resolve(error)
        })
    })
    return this.process
  }

  init () {
    console.info('[DATABASE] Init')
    return this.processInit()
  }

  close () {
    if (this.database) {
      this.database.close()
        .then(status => {
          console.info('[DATABASE] Closed')
        })
        .catch(error => {
          this.errorCB(error)
        })
    } else {
      console.info('[DATABASE] was not opened')
    }
  }
}

export default new Database()
