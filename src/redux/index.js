import { createStore, applyMiddleware } from 'redux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { produce } from 'immer'
import { get } from 'lodash/fp'
import * as moment from 'moment'

const initialState = {
  todos: [],
  events: {
    id: 0,
    items: [],
  },
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

export const createTodo = createAction('CREATE_TODO')
export const appendEvent = createAction('APPEND_EVENT')

// Store

const reducer = handleActions({
  [appendEvent]: (draft, action) => {
    draft.events.id += 1
    draft.events.items.push(action.payload)
  },
  [createTodo]: (draft, action) => {
    draft.todos.push(action.payload)
  },
}, initialState)


const events = new Set(['CREATE_TODO'])
const append = store => next => action => {
  if (!events.has(action.type)) {
    return next(action)
  }

  const timestamp = moment.utc().format()
  const { events: { id } } = store.getState()

  const event = {
    id,
    timestamp,
    ...action,
  }

  store.dispatch(appendEvent(event))
  return next(event)
}

const store = createStore(reducer, applyMiddleware(append))

// SELECTORS
export const selectTodos = get('todos')
export const selectEvents = get('events')

export default store
