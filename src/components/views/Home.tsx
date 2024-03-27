import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import { User } from "types";



const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        
        className="login input"
        placeholder="enter here.."
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



const Profil = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  const { userid } = useParams();
  const [user, setUser] = useState<User[]>(null);
  const [permit, setPermit] = useState<boolean>(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [username, setNewUsername] = useState<string>(null);
  const [birthDate, setBirthDate] = useState<string>(null);
  const token = localStorage.getItem("token");


  const toGame = (): void => {
    navigate("/game");
  };

  const editUser = async () => {
    try {
      const requestBody = JSON.stringify({username, birthDate});
      const response = await api.put(`/users/${userid}`, requestBody);
      
      //reload the page
      window.location.reload();
      
    } catch (error) {
      alert(
        `Something went wrong during the username edit: \n${handleError(error)}`
      );
    }
  };
  
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userid}`);

        
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUser(response.data);


        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Check if user and token are defined before comparison
    if (user && token === user.token) {
      setPermit(true);
    }
  }, [user]);
  const handleEditClick = () => {
    // Enable editing mode
    setEditingUsername(true);
  };

  const handleEditDateClick = () => {
    // Enable editing mode
    setEditingDate(true);
  }


  let content = <Spinner />;


  if (user) {
    content = (
      <div className="game">
        <ul className="game user-list">
          <li key={user.id}>
            <div className="profil container">
              <div className="data">
                <div className="label">Username: </div>
                {editingUsername ? (
                  <FormField
                    label={user.username}
                    value={username}
                    onChange={(un: string) => setNewUsername(un)}
                  />
                ) : (
                  <div className="value username">{user.username}</div>
                )}
              </div>
              {(
                <Button
                  className="edit-button"
                  onClick={editingUsername ? editUser : handleEditClick}
                >
                  {editingUsername ? "Save" : "Edit"}
                </Button>
              )}
            </div>
            <div className="profil container">
              <div className="profil data">
                <div className="label">Credits:</div> 
                <div className="value status">10000</div>
              </div>
            </div>
            <div className="profil container">
              <div className="data">
                <div className="label">Reloads:</div> 
                <div className="value creation-date">3</div>
              </div>
            </div>
            
          </li>
        </ul>
        <Button width="100%" onClick={() => toGame()}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Happy Coding!</h2>
      <p className="game paragraph">
        Get all users from secure endpoint:
      </p>
      {content}
    </BaseContainer>
  );
};

export default Profil;
