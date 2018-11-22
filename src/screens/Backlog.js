import React from 'react'
import PropTypes from 'prop-types'
import { produce } from 'immer'
import { Alert, Keyboard } from 'react-native'
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
  assignTodo,
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
    assignTodo: PropTypes.func.isRequired,
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

  handleAssignTodos = () => {
    mapKeys(this.props.assignTodo, this.state.selected)
    this.handleCancelSelect()
  }

  handleCancelSelect = () => {
    this.setState({
      mode: MODE_NORMAL,
      selected: {},
    })
  }

  handleCancelCreate = () => {
    this.setState({
      mode: MODE_NORMAL,
    })
    Keyboard.dismiss()
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
      <Fab onPress={this.handleAssignTodos}>
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
        onCancel={this.handleCancelCreate}
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

  renderNormalHeader = () => {
    if (this.state.mode !== MODE_NORMAL) {
      return null
    }

    const { navigation } = this.props

    return (
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
        <Right />
      </Header>
    )
  }

  renderCreateHeader = () => {
    if (this.state.mode !== MODE_CREATE) {
      return null
    }

    return (
      <Header>
        <Left>
          <Button
            transparent
            onPress={this.handleCancelCreate}
          >
            <Icon name="md-arrow-back" />
          </Button>
        </Left>
        <Right />
      </Header>
    )
  }

  renderSelectHeader = () => {
    if (this.state.mode !== MODE_SELECT) {
      return null
    }

    return (
      <Header>
        <Left>
          <Button
            transparent
            onPress={this.handleCancelSelect}
          >
            <Icon name="md-arrow-back" />
          </Button>
        </Left>
        <Right>
          <Button
            transparent
            onPress={this.handleConfirmDeleteTodos}
          >
            <Icon name="trash" />
          </Button>
        </Right>
      </Header>
    )
  }

  render() {
    const {
      todos,
    } = this.props

    const {
      selected,
      mode,
    } = this.state

    const disableTodoList = mode === MODE_CREATE

    return (
      <Container>
        { this.renderNormalHeader() }
        { this.renderCreateHeader() }
        { this.renderSelectHeader() }

        <Content keyboardShouldPersistTaps="always">
          <TodoList
            todos={todos}
            selected={selected}
            disable={disableTodoList}
            onSelectTodo={this.handleSelectTodo}
          />
        </Content>

        { this.renderCreateFab() }
        { this.renderAssignFab() }
        { this.renderCreateForm() }
      </Container>
    )
  }
}

export default attach({
  todos: selectTodos,
}, {
  createTodo,
  deleteTodo,
  assignTodo,
}, BacklogBase)
