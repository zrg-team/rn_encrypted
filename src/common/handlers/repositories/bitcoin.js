import moment from 'moment'
import { request } from '../../effects'
import Bitcoin from '../../../libraries/crypto/Bitcoin'
import { getEndpointByOperator } from '../operator'
import { TRANSACTION_HISTORY_LARGE_PAGE_SIZE } from '../../../configs'

class BitcoinRepository {
  getTransactionParams ({ obj, wallet }, { operator, asset }) {
    const isSent = obj.inputs.some(item => item.addresses.includes(wallet.bitcoin.address))
    let value = 0
    const to = obj.outputs.reduce((all, item) => {
      if (isSent && !item.addresses.includes(wallet.bitcoin.address)) {
        value = item.value
        return item.addresses[0]
      } else if (!isSent && item.addresses.includes(wallet.bitcoin.address)) {
        value = item.value
        return item.addresses[0]
      }
      return all
    }, 0)
    const from = isSent ? wallet.bitcoin.address : obj.inputs[0].addresses[0]
    return {
      // parser information
      network: 'public',
      // transaction
      operator: operator,
      txKey: `${obj.hash}_${operator}`,
      hash: obj.hash,
      from: from,
      to: to,
      value,
      timestamp: moment(obj.confirmed).unix(),
      gasPrice: 1,
      gasUsed: obj.fees,
      gas: obj.fees,
      blockNumber: obj.block_height,
      // status: +obj.status ? 'confirmed' : 'pending',
      status: obj.confirmations > 0
        ? 'success'
        : 'pending'
    }
  }

  async getTransactions (params, {
    asset,
    operator,
    operatorInformation
  }) {
    const { wallet } = params
    const apiParams = {
      limit: TRANSACTION_HISTORY_LARGE_PAGE_SIZE
    }
    if (params.page > 1) {
      apiParams.before = params.page
    }
    const { data } = await request({
      url: `${getEndpointByOperator(operator, 'wallet', operatorInformation)}/${wallet.bitcoin.address}/full`,
      params: apiParams
    })
    if (data.n_tx === 0) {
      return {
        result: [],
        totalPages: 0
      }
    }
    return {
      result: {
        data: data.txs,
        offset: data.txs.length,
        totalPages: data.n_tx / TRANSACTION_HISTORY_LARGE_PAGE_SIZE
      },
      next: data.txs[data.txs.length - 1].block_height
    }
  }

  async getBalance (params, {
    asset,
    operator,
    operatorInformation
  }) {
    const { wallet } = params
    const { data } = await request({
      url: `${getEndpointByOperator(operator, 'wallet', operatorInformation)}${wallet.bitcoin.address}/balance`
    })
    return {
      result: +data.final_balance < data.balance ? `${data.final_balance}` : `${data.balance}`,
      confirmed_balance: data.balance,
      unconfirmed_balance: data.unconfirmed_balance
    }
  }

  parseTransactionParams (params,
    {
      asset,
      operator,
      operatorInformation
    }
  ) {
    return {
      from: params.from,
      to: params.to,
      value: +params.value,
      listUnspent: params.listUnspent,
      feePerByte: params.feePerByte,
      privateKey: params.privateKey,
      max: params.max
    }
  }

  async sendRawTransaction (hex, {
    asset,
    operator,
    operatorInformation
  }) {
    const params = {
      url: `${getEndpointByOperator(operator, 'submit', operatorInformation)}`,
      method: 'POST',
      data: {
        tx: hex
      }
    }
    const { data } = await request(params)

    return data
  }

  async processSendTransaction (txData, { asset, operator, operatorInformation }) {
    const rawTx = this.createRawTransaction(txData)
    const { tx } = await this.sendRawTransaction(`${rawTx}`, { operator, operatorInformation })

    if (!tx || !tx.hash) {
      return { error: true, data: { code: 'TX_ERROR' } }
    }
    return {
      txId: tx.hash,
      rawTx: rawTx.tx_hex
    }
  }

  async getUnspentTransactions (address) {
    try {
      const data = await this.getUnspent(address)
      if (data) {
        const ids = []
        const unspent = [...data.txrefs || [], ...data.unconfirmed_txrefs || []]
          .filter(item => {
            if (!ids.includes(item.tx_hash)) {
              ids.push(item.tx_hash)
              return true
            }
            return false
          })
        return unspent
      }
      return []
    } catch (err) {
      return []
    }
  }

  async getUnspent (address) {
    const { data } = await request({
      url: `${getEndpointByOperator('bitcoin', 'unspent')}/${address}`,
      method: 'GET',
      params: {
        unspentOnly: true,
        limit: 2000
      }
    })
    return data
  }

  createRawTransaction (params) {
    const rawTx = Bitcoin.createRawTransaction(params)
    return rawTx.tx_hex
  }
}
export default new BitcoinRepository()
