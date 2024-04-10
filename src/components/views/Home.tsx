
import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import { User } from "types";
import PropTypes from "prop-types";


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


const Userdisplay = () => {
    
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const { userid } = useParams();
  const [lobbyId, setLobbyId] = useState("");
  const [username, setNewUsername] = useState<string>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const token = localStorage.getItem("token");


  const editUser = async () => {
    try {
      const requestBody = JSON.stringify({username});
      const response = await api.put(`/users/${userid}`, requestBody);
      
      //reload the page
      window.location.reload();
      
    } catch (error) {
      alert(
        `Something went wrong during the username edit: \n${handleError(error)}`
      );
    }
  };

  const logout = async () => {
    try {
      //const requestBody = JSON.stringify({username, birthDate});
      const response = await api.put("/users/logout");
      
    } catch (error) {
      alert(
        "Something went wrong while Logout! See the console for details."
      );
    }
    localStorage.clear();
    localStorage.removeItem("token");
    navigate("/login");
  };

  async function createTable() {
    try {

      const response = await api.post(`/lobbies`);
      console.log(response);
      localStorage.setItem("lobbyId", response.data.id); //TODO adjust game and save id
      navigate(`/game/${userid}`);
    }
    catch (error) {
      alert(
        `Something went wrong while creating the lobby: \n${handleError(error)}`
      );
    }
  }

  async function joinLobby() {
    try {
      const response = await api.put(`/lobbies/${lobbyId}`);
      localStorage.setItem("lobbyId", lobbyId);
      navigate(`/game/${userid}`);
    }
    catch (error) {
      alert(
          `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
    }



  }
  useEffect(() => {
    async function fetchData() {
      //alert(permit)
      try{
        const response = await api.get(`/users/${userid}`); 
        setUser(response.data);
      }
      catch (error){
        alert(
          `Something went wrong while fetching user: \n${handleError(error)}`
        );
        
        
        //incase of 401 errorcode, usertoken isn't real. remove and navigate to login.
        if (error.response.data.status === 401){
          localStorage.removeItem("token");
          navigate("/login");
        }
      }         
    }
    fetchData();
  }, [userid]);

 
  const handleEditClick = () => {
    // Enable editing mode
    setEditingUsername(true);
  };
    
  let content = <Spinner />;

  //let editbutton = (<Button width="100%"  onClick={() => navigate(`/edit/${userid}`)}>  Edit</Button>)

  //Credits: {user.credits} Reloads: {user.reloads}
  if (user) {
    content =  (
      <div className="homescreen">
        <div className="user container">
          <h1>Profile</h1>
          <div className="user item">
            <div className="label">Username: </div>
              <div className="data">
                {editingUsername ? (
                  <input className="input" width="50%" type="text" placeholder="Set new name"
                    value={username}
                    onChange={(e) => setNewUsername(e.target.value)}
                    />
                ) : (
                  <div className="value">{user.username}</div>
                )}
              
              {(
                <Button className="edit" onClick={editingUsername ? editUser : handleEditClick}>
                  {editingUsername ? "Save" : "Edit"}
                </Button>
              )}
            </div>
          </div>
          <div className="user item">
            <div className="label">Credits</div> 
            <div className="value">10&apos;000</div>
          </div>
          <div className="user item">
            <div className="label">Reloads</div> 
            <div className="value">0</div>
          </div>
          <Button className="button" width="35%"  onClick={() => logout()}>Quit</Button>
        </div>
        <div className="user container">
          <div className="user options">
            <div className="user actions">
              <h2>Play Poker</h2>
              <Button className="button"  onClick={() => createTable()}>Create Table</Button>
              </div>
            <div className="user actions">
              <h2>Enter Custom Table</h2>
              <input className="user input" type="text" placeholder="Insert table number"
                     value={lobbyId}
                     onChange={(e) => setLobbyId(e.target.value)} />
              <Button className="button" onClick={() => joinLobby()}>Join Table</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <BaseContainer>
      {content}
    </BaseContainer>
  );
};

export default Userdisplay;
