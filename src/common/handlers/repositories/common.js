import { request } from '../../effects'
import Ethereum from '../../../libraries/crypto/Ethereum'
import { getEndpointByOperator } from '../operator'
import { TRANSACTION_HISTORY_PAGE_SIZE } from '../../../configs'

class CommonRepository {
  getTransactionParams ({ obj }, { operator, asset, operatorInformation }) {
    const result = {
      // parser information
      network: obj.network || (operatorInformation && operatorInformation.network) || 'public',
      target: obj.target,
      logIndex: obj.logIndex,
      event: obj.event,
      args: typeof obj.args === 'string'
        ? obj.args : JSON.stringify(obj.args),
      argsValue: obj.argsValue,
      insertType: obj.insertType,
      // transaction
      logs: typeof obj.logs === 'string'
        ? obj.logs : JSON.stringify(obj.logs),
      operator: obj.publicOperator || obj.operator || operator,
      txKey: `${obj.hash || obj.transactionHash}_${operator}_${obj.logIndex}`,
      hash: obj.hash || obj.transactionHash,
      from: obj.from,
      to: obj.to,
      value: obj.value,
      timestamp: obj.timestamp,
      gasPrice: obj.gasPrice,
      gasUsed: obj.gasUsed,
      gas: obj.gas,
      blockNumber: obj.blockNumber,
      // status: +obj.status ? 'confirmed' : 'pending',
      status: obj.status === '0x0'
        ? 'failed'
        : obj.status === '0x1'
          ? 'success'
          : obj.status || 'success'
      // fee: mulBigNumbers([obj.gasPrice, (obj.gasUsed || obj.gas)])
    }
    result.param_1 = obj.contractAddress || asset.contractAddress
    return result
  }

  async getTransactions (params, {
    asset,
    operator,
    operatorInformation
  }) {
    const { wallet } = params
    const requestParams = {
      address: wallet.default.address,
      offset: TRANSACTION_HISTORY_PAGE_SIZE,
      page: params.page
    }
    const { data } = await request({
      url: getEndpointByOperator(operator, 'transactions', operatorInformation),
      params: requestParams
    })
    return data
  }

  async getBalance (params, {
    asset,
    operator,
    operatorInformation
  }) {
    const { wallet } = params
    const requestParams = {
      address: wallet.default.address
    }

    const { data } = await request({
      url: getEndpointByOperator(operator, 'balance', operatorInformation),
      params: requestParams
    })
    return data
  }

  parseTransactionParam (params,
    {
      asset,
      operator,
      operatorInformation
    }
  ) {
    return params
  }

  async sendRawTransaction (hex, {
    asset,
    operator,
    operatorInformation
  }) {
    const params = {
      url: `${getEndpointByOperator(operator, 'submit', operatorInformation)}`,
      method: 'GET',
      params: {
        hex
      }
    }
    const { data } = await request(params)

    return data
  }

  async getNonce (address, {
    asset,
    operator,
    operatorInformation
  }) {
    const { data } = await request({
      url: `${getEndpointByOperator(operator, 'nonce', operatorInformation)}`,
      params: {
        address
      }
    })

    return data
  }

  async processSendTransaction (txData, { asset, operator, operatorInformation }) {
    const { result: nonce } = await this.getNonce(txData.from, { asset, operator, operatorInformation })

    if (nonce == null || nonce === undefined) {
      return { error: true, data: { code: 'NONCE_ERROR' } }
    }

    txData.nonce = nonce
    const rawTx = this.createRawTransaction(txData, { operator })
    const { result: txId } = await this.sendRawTransaction(`${rawTx}`, { asset, operator, operatorInformation })

    if (!txId) {
      return { error: true, data: { code: 'TX_ERROR' } }
    }
    return {
      txId,
      rawTx
    }
  }

  createRawTransaction (params) {
    return `0x${Ethereum.createRawTransaction(params)}`
  }

  async estimateGas (tx, { asset, operator, operatorInformation }) {
    try {
      const { data } = await request({
        url: getEndpointByOperator(operator, 'estimateGas', operatorInformation),
        method: 'GET',
        params: tx
      })
      if (data && !data.error_code) {
        return data.result
      }
    } catch (err) {
      console.debug('[REPOSITORY] Common estimateGas', err)
      return null
    }
  }
}

export default new CommonRepository()
