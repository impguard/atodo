import React from 'react'
import PropTypes from 'prop-types'
import { selectTodos, createTodo, attach } from '../redux'
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

class BacklogBase extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    todos: PropTypes.array.isRequired,
    createTodo: PropTypes.func.isRequired,
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
          <Text>{this.props.todos}</Text>
          <Button onPress={() => this.props.createTodo()}>
            <Icon name="add" />
          </Button>
        </Content>

      </Container>
    )
  }
}

export default attach({
  todos: selectTodos,
}, {
  createTodo,
}, BacklogBase)
