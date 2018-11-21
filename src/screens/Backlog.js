import React from 'react'
import PropTypes from 'prop-types'
import { produce } from 'immer'
import { FlatList } from 'react-native'
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
  Text,
  Fab,
  ListItem,
} from 'native-base'
import { get, mapKeys } from 'lodash/fp'
import {
  selectTodos,
  createTodo,
  deleteTodo,
  attach,
} from '../redux'

// Internall keep track of selected state
// Will render color changes when selected
// Also allow one to "upgrade to sprint"
// Also allow one to "delete"
// Confirm delete
// Upgrade to sprint marks it as part of a sprint

class BacklogBase extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    todos: PropTypes.array.isRequired,
    createTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
  }

  state = {
    selected: {},
  }

  selectTodo = (id) => {
    this.setState(produce(draft => {
      if (draft.selected[id]) {
        delete draft.selected[id]
      } else {
        draft.selected[id] = true
      }
    }))
  }

  removeTodos = () => {
    this.setState(produce(draft => {
      mapKeys(this.props.deleteTodo, draft.selected)
      draft.selected = []
    }))
  }

  renderTodo = (attrs) => {
    const { item: todo } = attrs
    const selected = this.state.selected[todo.id]

    return (
      <ListItem
        selected={selected}
        onPress={() => this.selectTodo(todo.id)}
      >
        <Left>
          <Text>{todo.name}</Text>
        </Left>
        <Right>
          <Text>{todo.points}</Text>
        </Right>
      </ListItem>
    )
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
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
              onPress={this.removeTodos}
            >
              <Icon name="trash" />
            </Button>
            <Button transparent>
              <Icon name="arrow-round-forward" />
            </Button>
          </Right>
        </Header>

        <Content>
          <FlatList
            data={this.props.todos}
            extraData={this.state}
            keyExtractor={get('id')}
            renderItem={this.renderTodo}
          />
        </Content>

        <Fab onPress={() => this.props.createTodo('hi', 3)}>
          <Icon name="add" />
        </Fab>
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
