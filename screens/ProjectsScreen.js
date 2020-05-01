import React from "react";
import styled from "styled-components";

class ProjectsScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  render() {
    return (
      <Container>
        <Text>Projects Screen</Text>
      </Container>
    );
  }
}

export default ProjectsScreen;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;
