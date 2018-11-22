import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { isEmpty } from 'lodash/fp'
import {
  View,
  TextInput,
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
    onDirty: PropTypes.func,
  }

  static defaultProps = {
    onDirty: () => {},
  }

  state = {
    name: '',
    points: '',
  }

  onSubmit = () => {
    const { name, points } = this.state
    this.props.onSubmit(name, points)
  }

  onChange = () => {
    const { name, points } = this.state
    if (isEmpty(name) && isEmpty(points)) {
      this.props.onDirty(false)
    } else {
      this.props.onDirty(true)
    }
  }

  updateName = (name) => {
    this.setState({ name })
  }

  updatePoints = (points) => {
    this.setState({ points })
  }

  focusPoints = () => {
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
          onSubmitEditing={this.focusPoints}
          onChangeText={this.updateName}
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
          onChangeText={this.updatePoints}
          onSubmitEditing={this.onSubmit}
        />
        <SendButton
          transparent
          onPress={this.onSubmit}
        >
          <Icon name="send" />
        </SendButton>
      </EntryForm>
    )
  }
}

export default TodoCreator
