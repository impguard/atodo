import { createStore, applyMiddleware } from 'redux'
import { createSelector, createStructuredSelector } from 'reselect'
import { createAction } from 'redux-actions'
import { connect } from 'react-redux'
import { produce } from 'immer'
import { get } from 'lodash/fp'
import thunk from 'redux-thunk'

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

// HANDLERS

export const createTodo = () => async (dispatch) => {
  dispatch(todoCreated())
}

// ACTIONS

export const todoCreated = createAction('TODO_CREATED')

// STORE

const reducer = handleActions({
  [todoCreated]: (draft, action) => {
    draft.todos.push(1)
  }
}, initialState)

const store = createStore(reducer, applyMiddleware(thunk))

// SELECTORS

export const selectTodos = get('todos')

export default store
