import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { BlurView } from "expo-blur";
import Success from "./Success";
import Loading from "./Loading";
import { Alert } from "react-native";
import { Animated, Dimensions } from "react-native";
import firebase from "./Firebase";
import { AsyncStorage } from "react-native";
import { saveState } from "./AsyncStorage";

const screenHeight = Dimensions.get("window").height;

function mapStateToProps(state) {
  return { action: state.action };
}

function mapDispatchToProps(dispatch) {
  return {
    closeLogin: () =>
      dispatch({
        type: "CLOSE_LOGIN",
      }),
    updateName: (name) =>
      dispatch({
        type: "UPDATE_NAME",
        name,
      }),
    updateAvatar: (avatar) =>
      dispatch({
        type: "UPDATE_AVATAR",
        avatar,
      }),
  };
}

class ModalLogin extends React.Component {
  state = {
    email: "",
    password: "",
    iconEmail: require("../assets/icon-email.png"),
    iconPassword: require("../assets/icon-password.png"),
    isSuccesful: false,
    isLoading: false,
    top: new Animated.Value(screenHeight),
    scale: new Animated.Value(1.3),
    translateY: new Animated.Value(0),
  };

  componentDidMount() {
    this.retrieveName();
  }

  componentDidUpdate() {
    if (this.props.action === "openLogin") {
      Animated.timing(this.state.top, {
        toValue: 0,
        duration: 0,
      }).start();
      Animated.spring(this.state.scale, {
        toValue: 1,
      }).start();
      Animated.timing(this.state.translateY, {
        toValue: 0,
        duration: 0,
      }).start();
    }

    if (this.props.action === "closeLogin") {
      setTimeout(() => {
        Animated.timing(this.state.top, {
          toValue: screenHeight,
          duration: 0,
        }).start();
        Animated.spring(this.state.scale, {
          toValue: 1.3,
        }).start();
      }, 500);
      Animated.timing(this.state.translateY, {
        toValue: 1000,
        duration: 500,
      }).start();
    }
  }

  storeName = async (name) => {
    try {
      await AsyncStorage.setItem("name", name);
    } catch (error) {}
  };

  retrieveName = async () => {
    try {
      const name = await AsyncStorage.getItem("name");
      if (name !== null) {
        console.log(name);
        this.props.updateName(name);
      }
    } catch (error) {}
  };

  handleLogin = () => {
    console.log(this.state.email, this.state.password);

    this.setState({ isLoading: true });

    const email = this.state.email;
    const password = this.state.password;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        Alert.alert("Error", error.message);
      })
      .then((response) => {
        // console.log(response);

        this.setState({ isLoading: false });

        if (response) {
          Keyboard.dismiss();
          this.setState({ isSuccesful: true });
          Alert.alert("Congrats", "You've logged successfully!");

          // this.storeName(response.user.email);
          this.fetchUser();
          this.props.updateName(response.user.email);

          setTimeout(() => {
            this.props.closeLogin();
            this.setState({ isSuccesful: false });
          }, 1000);
        }
      });
  };

  fetchUser = () => {
    fetch("https://uifaces.co/api?limit=1", {
      headers: new Headers({
        "X-API-KEY": "2a795dc81bcc21a34565cb88c8ca5f",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        const name = response[0].name;
        const avatar = response[0].photo;
        saveState({ name, avatar });
        this.props.updateName(name);
        this.props.updateAvatar(avatar);
      });
  };

  focusEmail = () => {
    this.setState({
      iconEmail: require("../assets/icon-email-animated.gif"),
      iconPassword: require("../assets/icon-password.png"),
    });
  };

  focusPassword = () => {
    this.setState({
      iconEmail: require("../assets/icon-email.png"),
      iconPassword: require("../assets/icon-password-animated.gif"),
    });
  };

  tabBackground = () => {
    Keyboard.dismiss();
    this.props.closeLogin();
  };

  render() {
    return (
      <AnimatedContainer style={{ top: this.state.top }}>
        <TouchableWithoutFeedback onPress={this.tabBackground}>
          <BlurView
            tint="dark"
            intensity={100}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
        </TouchableWithoutFeedback>

        <AnimatedModal
          style={{
            transform: [
              { scale: this.state.scale },
              { translateY: this.state.translateY },
            ],
          }}
        >
          <Logo source={require("../assets/logo-dc.png")} />
          <Text>Start Learning.{"\n"} Access Pro Content.</Text>
          <TextInput
            onChangeText={(email) => this.setState({ email })}
            placeholder="Email"
            keyboardType="email-address"
            onFocus={this.focusEmail}
          />
          <TextInput
            onChangeText={(password) => this.setState({ password })}
            placeholder="Password"
            secureTextEntry={true}
            onFocus={this.focusPassword}
          />
          <IconEmail source={this.state.iconEmail} />
          <IconPassword source={this.state.iconPassword} />
          <TouchableOpacity onPress={this.handleLogin}>
            <Button>
              <ButtonText>Log In</ButtonText>
            </Button>
          </TouchableOpacity>
        </AnimatedModal>
        <Success isActive={this.state.isSuccesful} />
        <Loading isActive={this.state.isLoading} />
      </AnimatedContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalLogin);

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  justify-content: center;
  align-items: center;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const Modal = styled.View`
  width: 333px;
  height: 370px;
  background: white;
  border-radius: 20px;
  align-items: center;
  elevation: 40;
`;

const AnimatedModal = Animated.createAnimatedComponent(Modal);

const Logo = styled.Image`
  width: 44px;
  height: 44px;
  margin-top: 50px;
`;

const Text = styled.Text`
  margin-top: 20px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  color: #b8bece;
`;
const TextInput = styled.TextInput`
  border: 1px solid #dbdfea;
  width: 295px;
  height: 44px;
  border-radius: 10px;
  font-size: 17px;
  color: #3c4560;
  margin-top: 20px;
  padding-left: 44px;
`;

const Button = styled.View`
  background: #5263ff;
  width: 295px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  elevation: 8;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 20px;
  text-transform: uppercase;
`;

const IconEmail = styled.Image`
  width: 24px;
  height: 16px;
  position: absolute;
  top: 179px;
  left: 31px;
`;

const IconPassword = styled.Image`
  width: 18px;
  height: 24px;
  position: absolute;
  top: 239px;
  left: 35px;
`;