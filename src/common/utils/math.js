import { BigNumber } from 'bignumber.js'

export function addBigNumbers (values = []) {
  try {
    const results = values.reduce((all, item) => {
      return all.plus(new BigNumber(`${item}`))
    }, new BigNumber(0))
    return results.toFixed()
  } catch (err) {
    return 0
  }
}

export function mulBigNumbers (values = []) {
  try {
    const results = values.reduce((all, item, index) => {
      if (index === 0) {
        return all
      } else if (all.mul) {
        all = all.mul(new BigNumber(`${item}`))
      } else if (all.multipliedBy) {
        all = all.multipliedBy(new BigNumber(`${item}`))
      }
      return all
    }, new BigNumber(`${values[0]}`))
    return results.toFixed()
  } catch (err) {
    return 0
  }
}

export function divBigNumbers (values = []) {
  try {
    const results = values.reduce((all, item, index) => {
      if (index === 0) {
        return all
      } else if (all.div) {
        all = all.div(new BigNumber(`${item}`))
      } else if (all.dividedBy) {
        all = all.dividedBy(new BigNumber(`${item}`))
      }
      return all
    }, new BigNumber(`${values[0]}`))
    return results.toFixed()
  } catch (err) {
    return 0
  }
}

export function minusBigNumbers (values = []) {
  try {
    const results = values.reduce((all, item, index) => {
      if (index === 0) {
        return all
      }
      return all.minus(new BigNumber(`${item}`))
    }, new BigNumber(`${values[0]}`))
    return results.toFixed()
  } catch (err) {
    return 0
  }
}

export function toHexNumber (a) {
  try {
    const value = new BigNumber(`${a}`).toString(16)
    return `0x${value}`
  } catch (err) {
    return a
  }
}

export function isEqual (a, b) {
  try {
    return new BigNumber(`${a}`).isEqualTo(new BigNumber(`${b}`))
  } catch (err) {
    return false
  }
}

export function isGreaterThanOrEqual (a, b) {
  try {
    return new BigNumber(`${a}`).isGreaterThanOrEqualTo(new BigNumber(`${b}`))
  } catch (err) {
    return false
  }
}

export function isGreaterThan (a, b) {
  try {
    return new BigNumber(`${a}`).isGreaterThan(new BigNumber(`${b}`))
  } catch (err) {
    return false
  }
}

export function isLessThan (a, b) {
  try {
    return new BigNumber(`${a}`).isLessThan(new BigNumber(`${b}`))
  } catch (err) {
    return false
  }
}

export function isLessThanOrEqualTo (a, b) {
  try {
    return new BigNumber(`${a}`).isLessThanOrEqualTo(new BigNumber(`${b}`))
  } catch (err) {
    return false
  }
}

export function getDecimalValue (a) {
  try {
    const integerValue = new BigNumber(`${a}`).integerValue()
    const decimalValue = minusBigNumbers([a, integerValue])
    return decimalValue.split('.')[1]
  } catch (err) {
    return '0'
  }
}

export function getIntegerValue (a) {
  try {
    return new BigNumber(`${a}`).integerValue()
  } catch (err) {
    return '0'
  }
}
