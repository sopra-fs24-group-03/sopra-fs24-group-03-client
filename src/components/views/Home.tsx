import React, { useEffect, useState, useRef } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import { User } from "types";
import PropTypes from "prop-types";
import "styles/views/RulesOverlay.scss"; // Import the new stylesheet

const htmlContent = `
<h1>Poker Game Rules</h1>
<h2>Basics</h2>
<ul>
  <li>This poker game follows the rules of a classical "Texas Holdem" poker game.</li>
</ul>
<h3>Short explanation of the rules of Texas Holdem poker:</h3>
<h4>Overview</h4>
<ul>
  <li>In a game of Texas hold'em, each player is dealt two cards face down (the 'hole cards')</li>
  <li>Over several betting rounds, five more cards are (eventually) dealt face up in the middle of the table
    <ul>
      <li>These face-up cards are called the 'community cards.'</li>
    </ul>
  </li>
  <li>The goal of a Texas hold'em game is to use your hole cards in combination with the community cards to make the best possible five-card poker hand.</li>
</ul>
<h4>Game Structure</h4>
<ul>
  <li>The game starts by two players having to bet a mandatory "small blind" and "big blind". This small blind and big blind rotates around all players.
    <ul>
      <li>Without these blinds, the game would be very boring because no one would be required to put any money into the pot and players could just wait around until they are dealt good cards.</li>
    </ul>
  </li>
  <li>From there, multiple betting rounds start. After each betting round new Community cards are revealed on the table:
    <ul>
      <li>Preflop (before any community cards have been dealt),</li>
      <li>Flop (three community cards have been dealt)</li>
      <li>Turn (four community cards have been dealt)</li>
      <li>River (Five community cards have been dealt)</li>
    </ul>
  </li>
  <li>The first round of betting takes place right after each player has been dealt two hole cards.
    <ul>
      <li>The first player to act is the player to the left of the big blind.</li>
    </ul>
  </li>
  <li>During a betting round each player has his turn in order. A player can (depending on what happened before him):
    <ul>
      <li>Fold: Put his cards away and sit out the rest of the poker round. All the money he has bet up until now is lost for him.</li>
      <li>Raise: Put more money in the pot.</li>
      <li>Call: Call the amount of the previous raise. Which means putting the amount in the pot which the previous player raised.</li>
      <li>Check: If no one has raised in the current betting round one can check which means neither raise, call, or fold but just skip the turn.</li>
    </ul>
  </li>
  <li>A betting round ends if everyone either folded or called the raise of a person. Or after the pre-flop round also everyone can check.</li>
  <li>After the betting round new community cards get shown OR the game ends</li>
  <li>At the end of the game the player with the best hand is selected and he gets all the money in the pot.</li>
</ul>
<h4>The Hand Rankings in Texas Hold'em Poker (Top = best, bottom = worst)</h4>
<ul>
  <li>Royal Flush — five cards of the same suit, ranked ace through ten</li>
  <li>Straight Flush — five cards of the same suit and consecutively ranked</li>
  <li>Four of a Kind — four cards of the same rank</li>
  <li>Full House — three cards of the same rank and two more cards of the same rank</li>
  <li>Flush — any five cards of the same suit</li>
  <li>Straight — any five cards consecutively ranked</li>
  <li>Three of a Kind — three cards of the same rank</li>
  <li>Two Pair — two cards of the same rank and two more cards of the same rank</li>
  <li>One Pair — two cards of the same rank</li>
  <li>High Card — The one with the highest rank</li>
</ul>
<h4>For further information on Texas holdem poker just look up the rules on the internet since there are many great explanations there.</h4>
<h2>What is special about our version of the game</h2>
<h4>No real Money involved</h4>
<ul>
  <li>Our version of the game is completely free of charge and you can play with your friends for fun or practice for a poker night with real money.</li>
  <li>Upon creation of an account you get 2000 Credits. If you lose all of these you get a free refill back to 2000, but this is also shown in your profile for everyone else to see.</li>
</ul>
<h4>Blinds</h4>
<ul>
  <li>In the beginning, the Small Blind (25) and the Big blind (50) are automatically dealt by two people. The small and big blind rotate like in the normal Poker.
    <ul>
      <li>The first player who can make a move is the player after the big blind</li>
    </ul>
  </li>
</ul>
<h4>Moves</h4>
<ul>
  <li>Calling, Folding and Checking works like in the normal Poker. However Raising works a little different:
    <ul>
      <li>When someone Raises to 50 in the beginning of the round, lets say the big-blind, in normal poker you will say raise 50 again and then put 100 chips in the Pot. So you say the amount you want to add on top of the previous raise.</li>
      <li>In our version of the game however you say to which amount you want to raise (Notice "raise to" when rasing). This means, when someone Raises to 50 in the beginning of the round, lets say the big-blind, you have to say raise to 100 to set the raise to 100 and put 100 chips into the pot.</li>
    </ul>
  </li>
  <li>Also, you automatically fold when you don't make a move in 60 seconds. This is so that the game can still continue if someone decides to leave mid-poker round.</li>
</ul>
<h4>All in</h4>
<ul>
  <li>You can go all in by either Raising to all the money you have left, or by calling if you don't have enough money to call the previous raise.</li>
  <li>A side pot will automatically be created at the end of a betting round and then the money will be accordingly distributed to the players who are eligible.</li>
  <li>The sidepots and eligible players are calculated like in the normal Texas Hold em. However, instead of continuing to play with the sidepot, in this version of the game we create a sidepot, and then subtract that money from the Main pot (and remove non-eligible players from the main pot) and continue playing with the main pot.</li>
</ul>
<h4>End of the game</h4>
<ul>
  <li>At the end of the game only one winner will be displayed.</li>
  <li>If there are multiple side pots and different people win in different pots, only the winner who had the best hand overall will be displayed. This does not mean however that this person has won the most money.</li>
  <li>The money is distributed correctly independently of who is shown as the winner.</li>
  <li>At the end of a poker round everyone is sent back to the lobby and the lobby leader can start another round.</li>
</ul>
`;

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
  const [showRules, setShowRules] = useState(false); // State to manage the visibility of the rules
  const rulesRef = useRef(null);

  const logout = async () => {
    try {
      const response = await api.put("/users/logout");
    } catch (error) {
      alert("Something went wrong while Logout! See the console for details.");
    }
    localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  async function createTable() {
    try {
      const response = await api.post("/lobbies");
      console.log(response);
      localStorage.setItem("lobbyId", response.data.id);
      navigate(`/lobby/${userid}`);
    } catch (error) {
      alert(
        `Something went wrong while creating the lobby: \n${handleError(error)}`
      );
    }
  }

  async function joinLobby() {
    try {
      const response = await api.put(`/lobbies/${lobbyId}`);
      localStorage.setItem("lobbyId", lobbyId);
      navigate(`/lobby/${userid}`);
    } catch (error) {
      alert(
        `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
    }
  }

  const checkLobby = async (userId) => {
    try {
      const response = await api.get("/lobbies");
      localStorage.setItem("lobbyId", response.data.id);
      navigate(`/lobby/${userId}`);
    } catch (error) {
      // No lobby found
    }
  };

  useEffect(() => {
    checkLobby(userid);

    async function fetchData() {
      try {
        const response = await api.get(`/users/${userid}`);
        setUser(response.data);
      } catch (error) {
        alert(
          `Something went wrong while fetching user: \n${handleError(error)}`
        );

        if (error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    }

    fetchData();

    // Fetch the markdown content
    

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowRules(false);
      }
    };

    const handleClickOutside = (event) => {
      if (rulesRef.current && !rulesRef.current.contains(event.target)) {
        setShowRules(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userid]);

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="homescreen">
        <div className="user container">
          <h1>Profile</h1>
          <div className="user item">
            <div className="label">Username: </div>
            <div className="value">{user.username}</div>
          </div>
          <div className="user item">
            <div className="label">Credits</div>
            <div className="value">{user.money}</div>
          </div>
          <div className="user item">
            <div className="label">Reloads</div>
            <div className="value">{user.tries}</div>
          </div>
          <Button className="button" width="35%" onClick={() => logout()}>
            Quit
          </Button>
        </div>
        <div className="user container">
          <div className="user options">
            <div className="user actions">
              <h2>Play Poker</h2>
              <Button className="button" onClick={() => createTable()}>
                Create Table
              </Button>
            </div>
            <div className="user actions">
              <h2>Enter Custom Table</h2>
              <input
                className="user input"
                type="text"
                placeholder="Insert table number"
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value)}
              />
              <Button className="button" onClick={() => joinLobby()}>
                Join Table
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BaseContainer>
      {content}
      <button
        className="rules-toggle-button"
        onClick={() => setShowRules(!showRules)}
      >
        ?
      </button>
      {showRules && (
        <div className="rules-overlay">
          <div className="rules-content" ref={rulesRef}>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            <Button className="close-button" onClick={() => setShowRules(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </BaseContainer>
  );
};

export default Userdisplay;
