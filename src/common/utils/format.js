import BigNumber from 'bignumber.js'

export function pad (n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

export function formatCurrency (value, digit = 2) {
  try {
    const result = new BigNumber(`${value}`)
    return new BigNumber(result.toFixed(digit, BigNumber.ROUND_DOWN)).toFormat()
  } catch (err) {
    return '0'
  }
}

export function formatCrypto (value, digit = 6, options = {}) {
  try {
    const result = new BigNumber(`${value}`)
    if (options.showSmallValue && digit && result.isLessThan(`0.${pad(1, digit)}`) && result.isGreaterThan(0)) {
      return new BigNumber(result.toFixed()).toFormat()
    }
    return new BigNumber(result.toFixed(digit, BigNumber.ROUND_DOWN)).toFormat(options.keepFormat || undefined)
  } catch (err) {
    return '0'
  }
}
