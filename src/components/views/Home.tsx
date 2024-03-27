import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/User.scss";
import { User } from "types";
  

const Userdisplay = () => {
    
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const { userid } = useParams();

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

  if (user) {
    content =  (
      <div className="user">
        <div className="user item">Username: {user.username}</div>
        <div className="user item">Birthday: {user.birthday}</div>
        <div className="user item">Status: {user.status}</div>
        <div className="user item">Creation Date: {user.date}</div>
        <div className="user button-container">
          <Button
            width="100%"
            onClick={() => navigate("/game")}
          >
            Return
          </Button>
          {(localStorage.getItem("id") === userid) && editbutton}
        </div>
      </div>
    );
  }

  
  return (
    <BaseContainer className="user container">
      <h2>User Overview:</h2>
      {content}
    </BaseContainer>
  );
};

export default Userdisplay;