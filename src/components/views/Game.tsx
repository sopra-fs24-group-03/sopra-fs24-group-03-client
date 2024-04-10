import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";

const Player = ({ user, lobbyId, ownerId }: { user: User; lobbyId: Number; ownerId: Number}) => {
  const { userid } = useParams();
  async function remove(userToDeleteId) {
    try {
      const response = await api.delete(`lobbies/${lobbyId}/remove${userToDeleteId}`);
    }
    catch (error) {
      alert(
        `Something went wrong while deleting the User: \n${handleError(error)}`
      );
    }
  }
  return (<div className="player container">
    <div className="player usernameMoney">{user.username}: {user.money}</div>
    <button disabled={userid !== ownerId.toString()} className="player remove" onClick={() => remove(user.id)}>X</button>
  </div>);

};

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState 
  const [users, setUsers] = useState<User[]>(null);
  const { userid } = useParams();
  const [lobbyId, setLobbyId] = useState("");
  const [owner, setOwner] = useState<User>(null);
  async function leaveLobby() {
    try {
      const response = await api.delete(`/lobbies`);
      localStorage.removeItem("lobbyId");
      navigate(`/home/${userid}`);
    }
    catch (error) {
      alert(
          `Something went wrong while leaving the lobby: \n${handleError(error)}`
      );
    }
  }

  async function startGame() {

  }



  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://react.dev/reference/react/useEffect 
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/lobbies/${localStorage.getItem("lobbyId")}`); // lobbies/${localStorage.get("lobbyId")

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        console.log(response.data)
        setUsers(response.data.lobbyUsers);
        setOwner(response.data.lobbyLeader); // need to be changed to response.owner

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

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          <div className="player container">
            <div className="player owner">{owner.username}: {owner.money}</div>
          </div>
          {users.map((user: User) => (
            <li key={user.id}>
              <Player user={user} lobbyId={lobbyId} ownerId={owner.id}/>
            </li>
          ))}
        </ul>
        <Button className="button" onClick={() => leaveLobby()}>Leave Table</Button>
        <Button disabled={userid !== owner.id.toString()} className="button" onClick={() => startGame()}>Start Game</Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Play Poker</h2>
      {content}
    </BaseContainer>
  );
};

export default Game;
