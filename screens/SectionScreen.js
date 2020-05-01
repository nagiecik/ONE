import React from "react";
import { Button } from "react-native";
import styled from "styled-components";

class SectionScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  render() {
    return (
      <Container>
        <Text>Section Screen</Text>
        <Button
          title="Close"
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
      </Container>
    );
  }
}

export default SectionScreen;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;
