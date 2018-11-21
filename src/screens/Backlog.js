import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
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
  Input,
  Item,
  Form,
} from 'native-base'
import { get, mapKeys } from 'lodash/fp'
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
    entry: false,
    task: '',
    point: '',
    selected: {},
  }

  createTodo = () => {
    this.props.createTodo(this.state.task, this.state.point)
    this.setState({
      entry: false,
      task: '',
      point: '',
    })
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

  deleteTodos = () => {
    mapKeys(this.props.deleteTodo, this.state.selected)
    this.setState({ selected: [] })
  }

  updateTask = (task) => {
    this.setState({ task })
  }

  updatePoint = (point) => {
    this.setState({ point })
  }

  toggleEntry = () => {
    this.setState(produce(draft => {
      draft.entry = !draft.entry
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

  renderEntryForm = () => {
    if (!this.state.entry) {
      return null
    }

    return (
      <Form>
        <Item last>
          <Input
            placeholder="Task"
            value={this.state.task}
            onChangeText={this.updateTask}
            autoFocus
          />
          <Input
            placeholder="Point"
            value={this.state.point}
            onChangeText={this.updatePoint}
            keyboardType="number-pad"
          />
          <Button full success onPress={this.createTodo}>
            <Text>Add</Text>
          </Button>
        </Item>
      </Form>
    )
  }

  renderEntryFab = () => {
    if (this.state.entry) {
      return null
    }

    return (
      <Fab onPress={this.toggleEntry}>
        <Icon name="add" />
      </Fab>
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
              onPress={this.deleteTodos}
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
