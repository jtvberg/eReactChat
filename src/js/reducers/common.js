export const createErrorReducer = actionType =>
  (state = null, action) => {
    switch(action.type) {
      case `${actionType}_INIT`:
        return null
      case `${actionType}_ERROR`:
        console.log(action.error)
        return action.error
      default:
        return state
    }
  }

  export const createFetchingReducer = actionType =>
    (state = null, action) => {
      switch(action.type) {
        case `${actionType}_INIT`:
          return true
        case `${actionType}_SUCCESS`:
        case `${actionType}_ERROR`:
          return false
        default:
          return state
      }
    }