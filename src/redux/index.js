import { createStore } from 'redux'
import { createSelector, createStructuredSelector } from 'reselect'
import { createAction } from 'redux-actions'
import { connect } from 'react-redux'
import { produce } from 'immer'
import { get } from 'lodash/fp'

const initialState = {
  todos: [2],
}

// UTILS

const handleActions =
  (handlers, defaultState) =>
  (state = defaultState, action) =>
  produce(state, draft => {
    const handler = handlers[action.type]
    return handler && handler(draft, action)
  })

export const attach = (selectors, dispatchers, component) =>
  connect(createStructuredSelector(selectors), dispatchers)(component)

// ACTIONS

export const createTodo = createAction('CREATE_TODO')

// STORE

const reducer = handleActions({
  [createTodo]: (draft, action) => {
    draft.todos.push(1)
  }
}, initialState)

const store = createStore(reducer)

// SELECTORS

export const selectTodos = get('todos')

export default store
