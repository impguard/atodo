import React from 'react'
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

export default class Backlog extends React.Component {
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
        </Content>

      </Container>
    )
  }
}
