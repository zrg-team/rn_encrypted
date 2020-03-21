import { request } from '../../effects'
import { getEndpointByOperator } from '../operator'
import { TRANSACTION_HISTORY_PAGE_SIZE, ETHERSCAN_TOKENS } from '../../../configs'
import { TOKEN_TYPES } from '../../../modules/asset/models'
import Ethereum from '../../../libraries/crypto/Ethereum'

class ERC20Repository {
  constructor () {
    this.etherscanTokens = ETHERSCAN_TOKENS
    this.keyIndex = 0
  }

  getMinimalRequest () {
    const key = ETHERSCAN_TOKENS[this.keyIndex]
    if (this.keyIndex >= (ETHERSCAN_TOKENS.length - 1)) {
      this.keyIndex = 0
    } else {
      this.keyIndex++
    }
    return key
  }

  getTransactionParams ({ obj }, { operator, asset, operatorInformation }) {
    const result = {
      // parser information
      network: 'public',
      logIndex: obj.transactionIndex,
      // transaction
      operator: operator,
      txKey: `${obj.hash}_${operator}`,
      hash: obj.hash,
      from: obj.from,
      to: obj.to,
      value: obj.value,
      timestamp: obj.timeStamp,
      gasPrice: obj.gasPrice,
      gasUsed: obj.gasUsed,
      gas: obj.gas,
      blockNumber: obj.blockNumber,
      status: +obj.confirmations > 0
        ? 'success'
        : 'pending'
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
    operator = TOKEN_TYPES.erc20
    const token = this.getMinimalRequest()
    requestParams.apikey = token.key
    requestParams.contractAddress = asset.smartContract
    this.etherscanTokens[token.key] = +this.etherscanTokens[token.key] + 1
    const { data } = await request({
      url: getEndpointByOperator(operator, 'transactions', operatorInformation),
      params: requestParams
    })
    return { result: { data: data.result } }
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

    operator = TOKEN_TYPES.erc20
    requestParams.contractAddress = asset.smartContract
    const token = this.getMinimalRequest()
    requestParams.apikey = token.key
    this.etherscanTokens[token.key] = +this.etherscanTokens[token.key] + 1

    const { data } = await request({
      url: getEndpointByOperator(operator, 'balance', operatorInformation),
      params: requestParams
    })
    return data
  }

  parseTransactionParams (params,
    {
      asset = {},
      operator,
      operatorInformation
    }
  ) {
    return {
      ...params,
      value: '0x0',
      parentValue: params.value,
      to: asset.smartContract || operatorInformation.SMART_CONTRACT
    }
  }

  async sendRawTransaction (hex, {
    asset,
    operator,
    operatorInformation
  }) {
    const params = {
      url: `${getEndpointByOperator(TOKEN_TYPES.erc20, 'submit', operatorInformation)}`,
      method: 'POST',
      data: {
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
      url: `${getEndpointByOperator(TOKEN_TYPES.erc20, 'nonce', operatorInformation)}`,
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
        url: getEndpointByOperator(TOKEN_TYPES.erc20, 'estimateGas', operatorInformation),
        method: 'GET',
        params: tx
      })
      if (data && !data.error_code) {
        return data.result
      }
    } catch (err) {
      console.debug('[REPOSITORY] Erc20 estimateGas ', err)
      return null
    }
  }
}

export default new ERC20Repository()
