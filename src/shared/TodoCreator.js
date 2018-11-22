import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { isEmpty } from 'lodash/fp'
import {
  View,
  TextInput,
  Keyboard,
} from 'react-native'
import {
  Button,
  Icon,
} from 'native-base'

const EntryForm = styled(View)`
  flex-direction: row;
  background-color: #f4f4f4;
  border-bottom-width: 0.5px;
  border-bottom-color: #D9D5DC;
`

const Input = styled(TextInput)`
  font-family: Roboto;
  font-size: 17px;
  height: 50px;
  padding: 0 15px 0;
`

const NameInput = styled(Input)`
  flex: 1;
`

const PointsInput = styled(Input)`
  flex-basis: 80px;
`

const Separator = styled(View)`
  flex-basis: 1px;
  align-self: center;
  height: 80%;
  background-color: #c9c9c9;
  opacity: 0.5;
`

const SendButton = styled(Button)`
  justify-content: center;
  align-items: center;
  height: 100%;
`

class TodoCreator extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onDirty: PropTypes.func,
  }

  static defaultProps = {
    onCancel: () => {},
    onDirty: () => {},
  }

  state = {
    name: '',
    points: '',
  }

  componentDidMount() {
    this.keyboardListener = Keyboard.addListener('keyboardDidHide', this.props.onCancel)
  }

  componentWillUnmount() {
    this.keyboardListener.remove()
  }

  handleSubmit = () => {
    const { name, points } = this.state
    this.props.onSubmit(name, points)
  }

  handleDirty = (name, points) => {
    const isDirty = !isEmpty(name) || !isEmpty(points)
    this.props.onDirty(isDirty)
  }

  handleUpdateName = (name) => {
    this.setState({ name })
  }

  handleUpdatePoints = (points) => {
    this.setState({ points })
  }

  handlePointsFocus = () => {
    this.refs.points.focus()
  }

  render() {
    return (
      <EntryForm>
        <NameInput
          ref="name"
          placeholder="Task"
          placeholderTextColor="#575757"
          returnKeyType="next"
          onSubmitEditing={this.handlePointsFocus}
          onChangeText={this.handleUpdateName}
          blurOnSubmit={false}
          autoFocus
        />
        <Separator />
        <PointsInput
          ref="points"
          placeholder="Points"
          placeholderTextColor="#575757"
          keyboardType="number-pad"
          returnKeyType="send"
          onChangeText={this.handleUpdatePoints}
          onSubmitEditing={this.handleSubmit}
        />
        <SendButton
          transparent
          onPress={this.handleSubmit}
        >
          <Icon name="send" />
        </SendButton>
      </EntryForm>
    )
  }
}

export default TodoCreator
