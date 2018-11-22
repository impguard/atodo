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
    onSelectTodo: PropTypes.func.isRequired,
  }

  renderTodo = (attrs) => {
    const { item: todo } = attrs
    const { selected, onSelectTodo } = this.props

    const isSelected = selected[todo.id]

    return (
      <ListItem
        selected={isSelected}
        onPress={() => onSelectTodo(todo.id)}
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
