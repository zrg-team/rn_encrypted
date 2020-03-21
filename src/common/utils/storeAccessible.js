import redux from '../store'

function defaultDispatch () {
  console.debug('[REDUX] Missing dispatch')
}

class StoreAccessible {
  /**
   * @protected
   */
  getStates () {
    return (redux.store && redux.store.getState()) || {}
  }

  /**
   * @protected
   */
  getState (moduleName) {
    if (!moduleName) {
      return {}
    }
    const store = (redux.store && redux.store.getState()) || {}
    return store[moduleName] || {}
  }

  /**
   * @protected
   */
  dispatch (action) {
    return redux.store && redux.store.dispatch
      ? redux.store.dispatch(action)
      : defaultDispatch(action)
  }
}

export default new StoreAccessible()
