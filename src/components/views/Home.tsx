import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import { User } from "types";
  

const Userdisplay = () => {
    
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const { userid } = useParams();
  const [lobbyId, setLobbyId] = useState("");
  async function createTable() {
    try {
      const response = await api.post(`/lobbies/${userid}`);
      localStorage.setItem("lobbyId", response.lobbyId);
      navigate(`/game/${userid}`)
    }
    catch (error) {
      alert(
        `Something went wrong while creating the lobby: \n${handleError(error)}`
      );
    }
  }

  async function joinLobby() {
    try {
      const response = await api.put(`/lobbies/${lobbyId}/add/${userid}`);
      localStorage.setItem("lobbyId", lobbyId);
      navigate(`/game`);
    }
    catch (error) {
      alert(
          `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
    }



  }
  useEffect(() => {
    async function fetchData() {
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
    
  let content = <Spinner />;

  let editbutton = (<Button width="100%"  onClick={() => navigate(`/edit/${userid}`)}>  Edit</Button>)

  //Credits: {user.credits} Reloads: {user.reloads}
  if (user) {
    content =  (
      <div className="homescreen">
        <div className="user container">
          <h2>Profile</h2>
          <div className="user item">
            <div className="label">Username</div> 
            <div className="value">{user.username}</div>
          </div>
          <div className="user item">
            <div className="label">Credits</div> 
            <div className="value">10&apos;000</div>
          </div>
          <div className="user item">
            <div className="label">Reloads</div> 
            <div className="value">0</div>
          </div>
        </div>
        <div className="user container">
          <div className="user options">
            <div className="user actions">
              <h2>Play Poker</h2>
              <Button width="100%"  onClick={() => createTable()}>Create Table</Button>
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