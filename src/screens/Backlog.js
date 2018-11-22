import React from 'react'
import PropTypes from 'prop-types'
import { produce } from 'immer'
import { Alert } from 'react-native'
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
import { mapKeys, isEmpty, size } from 'lodash/fp'
import TodoCreator from '../shared/TodoCreator'
import TodoList from '../shared/TodoList'
import {
  selectTodos,
  createTodo,
  deleteTodo,
  attach,
} from '../redux'

const MODE_NORMAL = 'normal'
const MODE_CREATE = 'create'
const MODE_SELECT = 'select'

class BacklogBase extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    todos: PropTypes.array.isRequired,
    createTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
  }

  state = {
    mode: MODE_NORMAL,
    selected: {},
  }

  handleCreateTodo = (name, points) => {
    this.props.createTodo({
      name,
      points,
      listing: 'backlog',
    })

    this.handleSwitchMode(MODE_NORMAL)
  }

  handleSelectTodo = (id) => {
    this.setState(produce(draft => {
      if (draft.selected[id]) {
        delete draft.selected[id]
      } else {
        draft.selected[id] = true
      }

      draft.mode = isEmpty(draft.selected)
        ? MODE_NORMAL
        : MODE_SELECT
    }))
  }

  handleDeleteTodos = () => {
    mapKeys(this.props.deleteTodo, this.state.selected)
    this.handleCancelSelect()
  }

  handleCancelSelect = () => {
    this.setState({
      mode: MODE_NORMAL,
      selected: {},
    })
  }

  handleSwitchMode = (mode) => {
    this.setState({ mode })
  }

  handleConfirmDeleteTodos = () => {
    const count = size(this.state.selected)

    Alert.alert(
      '',
      `Delete ${count} tasks?`,
      [
        { text: 'Cancel', onPress: this.handleCancelSelect },
        { text: 'OK', onPress: this.handleDeleteTodos },
      ],
    )
  }

  renderAssignFab = () => {
    if (this.state.mode !== MODE_SELECT) {
      return null
    }

    return (
      <Fab onPress={this.handleAssign}>
        <Icon type="FontAwesome" name="level-up" />
      </Fab>
    )
  }

  renderCreateForm = () => {
    if (this.state.mode !== MODE_CREATE) {
      return null
    }

    return (
      <TodoCreator
        onSubmit={this.handleCreateTodo}
      />
    )
  }

  renderCreateFab = () => {
    if (this.state.mode !== MODE_NORMAL) {
      return null
    }

    return (
      <Fab onPress={() => this.handleSwitchMode(MODE_CREATE)}>
        <Icon name="add" />
      </Fab>
    )
  }

  renderSelectMenu = () => {
    if (this.state.mode !== MODE_SELECT) {
      return null
    }

    return (
      <React.Fragment>
        <Button
          transparent
          onPress={this.handleConfirmDeleteTodos}
        >
          <Icon name="trash" />
        </Button>
      </React.Fragment>
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
            {this.renderSelectMenu()}
          </Right>
        </Header>

        <Content keyboardShouldPersistTaps="always">
          <TodoList
            todos={todos}
            selected={selected}
            onSelectTodo={this.handleSelectTodo}
          />
        </Content>

        { this.renderCreateFab() }
        { this.renderCreateForm() }
        { this.renderAssignFab() }
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
