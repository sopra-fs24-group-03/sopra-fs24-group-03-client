import React, { useEffect, useState, useRef } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User } from "types";
import { usePageVisibility } from "helpers/usePageVisibility";

const Player = ({ user, lobbyId, ownerId }: { user: User; lobbyId: Number; ownerId: Number }) => {
  const { userid } = useParams();
  const navigate = useNavigate();

  async function remove(userToDeleteId) {
    try {
      const response = await api.delete(`lobbies/${lobbyId}/remove/${userToDeleteId}`);
    } catch (error) {
      alert(
        `Something went wrong while deleting the User: \n${handleError(error)}`,
      );
    }
  }

  return (<div className="player container">
    <div className="player usernameMoney">{user.username}: {user.money}</div>
    <div className="player tries">{user.tries} Reloads</div>
    <button style={{ visibility: userid === ownerId.toString() ? "visible" : "hidden" }} className="player remove"
      onClick={() => remove(user.id)}>X
    </button>
  </div>);

};

Player.propTypes = {
  user: PropTypes.object,
};

const Lobby = () => {

  const isPageVisible = usePageVisibility();
  const timerIdRef = useRef(null);
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState 
  const [users, setUsers] = useState<User[]>(null);
  const { userid } = useParams();
  const lobbyId = localStorage.getItem("lobbyId");
  const [owner, setOwner] = useState<User>(null);
  const [Disabled, setDisabled] = useState(false);

  async function leaveLobby() {
    try {
      const response = await api.delete("/lobbies");
      localStorage.removeItem("lobbyId");
      navigate(`/home/${userid}`);
    } catch (error) {
      alert(
        `Something went wrong while leaving the lobby: \n${handleError(error)}`,
      );
    }
  }

  async function startGame() {
    setDisabled(true);
    setTimeout(() => setDisabled(false), 2500);
    try {
      const response = await api.post(`/lobbies/${localStorage.getItem("lobbyId")}`); // create game
      navigate(`/table/${userid}`);
    } catch (error) {
      alert(
        `Something went wrong while starting game: \n${handleError(error)}`,
      );
    }
  }

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://react.dev/reference/react/useEffect 
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    const pollingCallback = () => {
      async function fetchData() {
        try {
          const response = await api.get("/lobbies");

          if (response.data.game !== null && response.data.game.gameFinished === false) {
            navigate(`/table/${userid}`);
          }
          await new Promise((resolve) => setTimeout(resolve, 100));


          setUsers(response.data.lobbyUsers);
          setOwner(response.data.lobbyLeader); // need to be changed to response.owner

          // See here to get more data.

        } catch (error) {
          if (error.response && error.response.status === 404) {
            // 404 corresponds to HttpStatus.NOT_FOUND
            localStorage.removeItem("lobbyId");
            navigate(`/home/${userid}`);
            alert("you have been kicked out of the lobby")
          } else {
            localStorage.clear();
            console.error(
              `Something went wrong while fetching the users: \n${handleError(
                error,
              )}`,
            );
            console.error("Details:", error);
            alert(
              "Something went wrong while fetching the users! See the console for details.",
            );
          }
        }
      }

      fetchData();
    };

    const startPolling = () => {
      // pollingCallback(); // To immediately start fetching data
      // Polling every  second
      timerIdRef.current = setInterval(pollingCallback, 1000);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPageVisible && isPollingEnabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isPageVisible, isPollingEnabled]);


  let content = <Spinner />;

  if (users) {
    content = (
      <div className="game">
        <h2>Lobby ID: {lobbyId}</h2>
        <ul className="game user-list">
          <div className="player container">
            <div className="player owner">{owner.username}: {owner.money}</div>
            <div className="player tries">{owner.tries} Reloads</div>
            <button style={{ visibility:"hidden" }} className="player remove">X
            </button>
          </div>
          {users
            .filter((user: User) => user.id !== owner.id)
            .map((user: User, index: number) => ((
              <li key={user.id}>
                <Player user={user} lobbyId={lobbyId} ownerId={owner.id} />
              </li>
            )))}
        </ul>
        <div className="game button-container">
          <Button className="button" width="50%" onClick={() => leaveLobby()}>Leave Table</Button>
          <Button disabled={users.length < 2 || userid !== owner.id.toString()} className="button" width="50%"
            onClick={() => startGame()}>Start Game</Button> {/* disable button */}
        </div>
      </div>

    );
  }

  return (
    <div className="game container">
      {content}
    </div>
  );
};

export default Lobby;
