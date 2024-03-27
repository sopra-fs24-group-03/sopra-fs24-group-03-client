import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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
        className="login input"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null); //function not implemented yet

  

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login register">
          <h2>Register</h2>
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          
          <FormField
            label="password"
            value={password}
            onChange={(p: string) => setPassword(p)} //functions not implemented yet
          />
          
          <div className="login button-container">
            <Button
              width="45%"
              onClick= {() => navigate("/login")}
            >
              Back
            </Button>
            <Button
              width="45%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
            
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Register;
