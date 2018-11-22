import { createStore, applyMiddleware } from 'redux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { produce } from 'immer'
import { get, map, toString, findIndex } from 'lodash/fp'
import * as moment from 'moment'
import uuidv4 from 'uuid/v4'
import { _keyEq } from '../utils'

const initialState = {
  todos: [
    {
      id: 'one',
      name: 'Wash the dishes',
      points: '3',
      assigned: false,
      listing: 'backlog',
    },
    {
      id: 'two',
      name: 'Deal with Aaron',
      points: '8',
      assigned: false,
      listing: 'backlog',
    },
    {
      id: 'three',
      name: 'Kiss spin',
      points: '1',
      assigned: false,
      listing: 'backlog',
    },
  ],
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
  const { name, points, listing } = payload

  return {
    id,
    name,
    points,
    listing,
  }
})

export const deleteTodo = createAction('DELETE_TODO', (id) => ({ id }))
export const assignTodo = createAction('ASSIGN_TODO', (id) => ({ id }))
export const appendEvent = createAction('APPEND_EVENT')

// Store

const findTodoIndex = (id, todos) => findIndex(_keyEq('id', id), todos)

const reducer = handleActions({
  [appendEvent]: (draft, action) => {
    draft.events.push(action.payload)
  },
  [createTodo]: (draft, action) => {
    draft.todos.push(action.payload)
  },
  [assignTodo]: (draft, action) => {
    const index = findTodoIndex(action.payload.id, draft.todos)
    draft.todos[index].assigned = true
  },
  [deleteTodo]: (draft, action) => {
    const index = findTodoIndex(action.payload.id, draft.todos)
    draft.todos.splice(index, 1)
  },
}, initialState)


const events = new Set(map(toString, [createTodo, deleteTodo, assignTodo]))
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
