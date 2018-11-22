import React from 'react'
import PropTypes from 'prop-types'
import { produce } from 'immer'
import {
  Container,
  Header,
  Body,
  Left,
  Right,
  Title,
  Content,
  Button,
  Icon,
  Fab,
} from 'native-base'
import { mapKeys } from 'lodash/fp'
import TodoCreator from '../shared/TodoCreator'
import TodoList from '../shared/TodoList'
import {
  selectTodos,
  createTodo,
  deleteTodo,
  attach,
} from '../redux'

class BacklogBase extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    todos: PropTypes.array.isRequired,
    createTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
  }

  state = {
    entry: true,
    selected: {},
  }

  handleCreateTodo = (name, points) => {
    this.props.createTodo({
      name,
      points,
      listing: 'backlog',
    })

    this.handleEntryToggle()
  }

  handleSelectTodo = (id) => {
    this.setState(produce(draft => {
      draft.selected[id] = !draft.selected[id]
    }))
  }

  handleDeleteTodos = () => {
    mapKeys(this.props.deleteTodo, this.state.selected)
    this.setState({ selected: [] })
  }

  handleEntryToggle = () => {
    this.setState(produce(draft => {
      draft.entry = !draft.entry
    }))
  }

  renderEntryForm = () => {
    if (!this.state.entry) {
      return null
    }

    return (
      <TodoCreator
        onSubmit={this.handleCreateTodo}
      />
    )
  }

  renderEntryFab = () => {
    if (this.state.entry) {
      return null
    }

    return (
      <Fab onPress={this.handleEntryToggle}>
        <Icon name="add" />
      </Fab>
    )
  }

  render() {
    const {
      navigation,
      todos,
    } = this.props

    const {
      selected,
    } = this.state

    return (
      <Container keyboardShouldPersistTaps="always">
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => navigation.openDrawer()}
            >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Backlog</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={this.handleDeleteTodos}
            >
              <Icon name="trash" />
            </Button>
            <Button transparent>
              <Icon name="arrow-round-forward" />
            </Button>
          </Right>
        </Header>

        <Content keyboardShouldPersistTaps="always">
          <TodoList
            todos={todos}
            selected={selected}
            onSelectTodo={this.handleSelectTodo}
          />
        </Content>

        { this.renderEntryFab() }
        { this.renderEntryForm() }
      </Container>
    )
  }
}

export default attach({
  todos: selectTodos,
}, {
  createTodo,
  deleteTodo,
}, BacklogBase)
