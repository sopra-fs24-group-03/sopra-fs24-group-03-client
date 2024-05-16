import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import { User } from "types";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import "styles/views/RulesOverlay.scss"; // Import the new stylesheet

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
  const [markdownContent, setMarkdownContent] = useState("");
  const [showRules, setShowRules] = useState(false); // State to manage the visibility of the rules

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

        if (error.response.data.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    }

    fetchData();

    // Fetch the markdown content
    fetch("/rules.md")
      .then((response) => response.text())
      .then((text) => setMarkdownContent(text));

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowRules(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
          <div className="rules-content">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
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
