import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Background from "./Login.jpg";


/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        type={props.inputType}  // Use the inputType prop to set the type of the input
        className="login input"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  inputType: PropTypes.string, // New prop type for input type
  value: PropTypes.string,
  onChange: PropTypes.func,
};


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null); //change to check if user exists

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.put("/users/login", requestBody); //api call doesnt work as planned
      //alert(response)
      // Get the returned user and update a new object.
      const user = new User(response.data); //create a new user object for logged in user
      
      // Store the token into the local storage.
      localStorage.setItem("token", user.token); 
      localStorage.setItem("userId", user.id); //store the user id in the local storage (needed for the GameRouter

      // Login successfully worked --> navigate to the route /home in the GameRouter
      checkLobby(user.id);

    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };
  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody); //api call to the UserController @PostMapping("/users")

      // Get the returned user and update a new object.
      const user = new User(response.data);
      //alert(user)

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.id); //store the user id in the local storage (needed for the GameRouter


      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate(`/home/${user.id}`);
    } catch (error) {
      alert(
        `Something went wrong during the register: \n${handleError(error)}`
      );
    }
  };
  const checkLobby = async ( userId) => {
    try {
      const response = await api.get("/lobbies");
      localStorage.setItem("lobbyId", response.data.id);
      //alert("existing lobby found")
      navigate(`/lobby/${userId}`);

    } catch (error) {
      //alert("no lobby found")
      navigate(`/home/${userId}`);
    }
  }

  return (
    <BaseContainer>
      <div className="login-container-custom">
        <div className="login container">
          <div className="login form">
            <h2>Welcome, let&apos;s play Poker</h2>
            
            <FormField
              label="Username"
              inputType="text"
              value={username}
              onChange={(un: string) => setUsername(un)}
            />
            <FormField
              label="Password"
              inputType="password"
              value={password}
              onChange={(p) => setPassword(p)}
            />
            
            <div className="login button-container" >
              <Button 
                className="login button"
                disabled={!username || !password}
                width="45%"
                onClick={() => doLogin()}
              >
                Login
              </Button>
              <Button
                className="login button"
                disabled={!username || !password}
                width="45%"
                onClick= {() => doRegister()}
              >
                New User
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
