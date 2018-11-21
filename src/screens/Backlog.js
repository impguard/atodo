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
  Fab,
} from 'native-base'
import {
  selectTodos,
  createTodo,
  attach,
} from '../redux'


class BacklogBase extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    todos: PropTypes.array.isRequired,
    createTodo: PropTypes.func.isRequired,
  }

  renderTodo = (todo) => (
    <Text>{todo.name}</Text>
  )

  renderRightMenu = () => (
    <Button>
      <Icon name="add" />
    </Button>
  )

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

        <Content>
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
}, BacklogBase)
