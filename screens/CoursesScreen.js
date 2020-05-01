import React from "react";
import styled from "styled-components";

class CoursesScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  render() {
    return (
      <Container>
        <Text>Courses Screen</Text>
      </Container>
    );
  }
}

export default CoursesScreen;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;
