import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/fp'
import { FlatList } from 'react-native'
import {
  ListItem,
  Left,
  Right,
  Text,
} from 'native-base'

class TodoList extends React.Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    selected: PropTypes.object.isRequired,
    disable: PropTypes.bool,
    onSelectTodo: PropTypes.func.isRequired,
  }

  static defaultProps = {
    disable: false,
  }

  handleSelectTodo = (id) => {
    if (this.props.disable) {
      return
    }

    this.props.onSelectTodo(id)
  }

  renderTodo = (attrs) => {
    const { item: todo } = attrs
    const { selected } = this.props

    const isSelected = selected[todo.id]

    return (
      <ListItem
        selected={isSelected}
        onPress={() => this.handleSelectTodo(todo.id)}
      >
        <Left>
          <Text>{todo.name}</Text>
        </Left>
        <Right>
          <Text>{todo.listing}</Text>
          <Text>{todo.points}</Text>
        </Right>
      </ListItem>
    )
  }

  render() {
    const {
      todos,
      selected,
    } = this.props

    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        data={todos}
        extraData={selected}
        keyExtractor={get('id')}
        renderItem={this.renderTodo}
      />
    )
  }
}

export default TodoList
