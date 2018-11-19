// import { createStore } from 'redux'
// import { createSelector } from 'reselect'
// import { produce } from 'immer'
// import { get } from 'lodash/fp'
//
// const INITIAL_STATE = {
//   backlog: {
//     todos: [2],
//   },
// }
//
// // ACTIONS
//
//
// // STORE
//
// const handleActions =
//   (handlers, defaultState) =>
//   (state = defaultState, action) =>
//   produce(state, draft => {
//     const handler = handlers[action.type]
//     return handler && handler.call(draft, action)
//   })
//
//
// const reducer = handleActions({
// }, INITIAL_STATE)
//
// const store = createStore(reducer)
//
// // SELECTORS
//
// export const selectBacklog = get('backlog')
//
// export const selectBacklogTodos = createSelector(
//   selectBacklog,
//   get('todos')
// )
//
// export default store
