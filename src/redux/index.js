import { createStore, applyMiddleware } from 'redux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { produce } from 'immer'
import { get, map, toString } from 'lodash/fp'
import * as moment from 'moment'
import uuidv4 from 'uuid/v4'
import { _keyEq } from '../utils'

const initialState = {
  todos: [],
  events: [],
}

// Utils

export const attach = (selectors, dispatchers, component) => (
  connect(createStructuredSelector(selectors), dispatchers)(component)
)

const handleActions =
  (handlers, defaultState) =>
    (state = defaultState, action) =>
      produce(state, draft => {
        const handler = handlers[action.type]
        return handler && handler(draft, action)
      })

// Actions

export const createTodo = createAction('CREATE_TODO', (payload) => {
  const id = uuidv4()
  const { name, points, listing = 'backlog' } = payload

  return {
    id,
    name,
    points,
    listing,
  }
})

export const deleteTodo = createAction('DELETE_TODO', (id) => ({ id }))
export const appendEvent = createAction('APPEND_EVENT')

// Store

const reducer = handleActions({
  [appendEvent]: (draft, action) => {
    draft.events.push(action.payload)
  },
  [createTodo]: (draft, action) => {
    draft.todos.push(action.payload)
  },
  [deleteTodo]: (draft, action) => {
    const index = draft.todos.findIndex(_keyEq('id', action.payload.id))
    draft.todos.splice(index, 1)
  },
}, initialState)


const events = new Set(map(toString, [createTodo, deleteTodo]))
const appender = store => next => action => {
  if (!events.has(action.type)) {
    return next(action)
  }

  const event = {
    id: uuidv4(),
    timestamp: moment.utc().format(),
    ...action,
  }

  store.dispatch(appendEvent(event))
  return next(event)
}

const store = createStore(reducer, applyMiddleware(appender))

// SELECTORS
export const selectTodos = get('todos')
export const selectEvents = get('events')

export default store
