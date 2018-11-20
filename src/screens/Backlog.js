import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Header,
  Left,
  Body,
  Title,
  Button,
  Icon,
  Right,
  Content,
  Text,
} from 'native-base'
import {
  selectTodos,
  selectEvents,
  createTodo,
  attach,
} from '../redux'


class BacklogBase extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    todos: PropTypes.array.isRequired,
    createTodo: PropTypes.func.isRequired,
  }

  createTodo = (name, points) => {
    this.props.createTodo({ name, points })
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
          <Right />
        </Header>

        <Content padder>
          <Text>Hello my man...</Text>
          <Text>{this.props.todos.map(todo => todo.name)}</Text>
          <Button onPress={() => this.createTodo('hi', 3)}>
            <Icon name="add" />
          </Button>
        </Content>

      </Container>
    )
  }
}

export default attach({
  todos: selectTodos,
  events: selectEvents,
}, {
  createTodo,
}, BacklogBase)
