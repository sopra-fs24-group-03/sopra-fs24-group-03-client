import React, { useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import "styles/views/Table.scss";
import "../../styles/views/Header.scss";
import tableImage from "./table_prov.jpg";
import { User, TableType, Player,Game } from "types";
import { useNavigate, useParams } from "react-router-dom";
import { usePageVisibility } from "helpers/usePageVisibility";
import Confetti from "react-confetti";

const Table = () => {

  const isPageVisible = usePageVisibility();
  const timerIdRef = useRef(null);
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  const gameId  = localStorage.getItem("lobbyId");
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [showRaiseInput, setShowRaiseInput] = useState(false);

  const [table, setTable] = useState<TableType | null>(null);  // Initially null, set a proper structure once loaded
  const [players, setPlayers] = useState<Player[]>([]);  // Initialize as an empty array
  const [player, setPlayer] = useState<Player | null>(null);  // Initially null
  const [game, setGame] = useState<Game | null>(null);  // Initially null

  const [showConfetti, setShowConfetti] = useState(true);

  const navigate = useNavigate();
  const { userid } = useParams();

  useEffect(() => {
    if(game && game.gameFinished){
      setIsPollingEnabled(false)
      setTimeout(function() {
        navigate(`/lobby/${userid}`); // player.id is true but doesnt give much sense
      }, 25000);
    }
  }, [game && game.gameFinished]);

  useEffect(() => {
    const pollingCallback = () => {
      async function fetchTable() {
        try {
          const tableResp = await api.get(`/games/${localStorage.getItem("lobbyId")}`);
          console.log(tableResp)
          setPlayer(tableResp.data.ownPlayer)
          setPlayers(tableResp.data.players)
          setTable(tableResp.data.gameTable)
          setGame(tableResp.data)
          //tableFiller();
        } catch (error) {
          alert(`Something went wrong while fetching the user: \n${error}`);
        }
      }
      fetchTable();
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

  /*api put body: {"move": ---, "ammount": ---} */

  function enemyPosition(enemy) {
    if (!player) return ''; // Guard clause if player is not defined yet
    const enemyIndex = players.findIndex((p) => p.id === enemy.id);
    const playerIndex = players.findIndex((p) => p.id === player.id);
    const beforeIndex = 6; // Maximum for descending index
    const afterIndex = 1; // Start for ascending index

    if (enemyIndex < playerIndex) {
      // Enemy is before player
      return `pos${beforeIndex - (playerIndex - enemyIndex - 1)}`;
    } else {
      // Enemy is after player
      return `pos${afterIndex + (enemyIndex - playerIndex - 1)}`;
    }
  }

  const call = async () => {
    try {
      const requestBody = JSON.stringify({ move: "Call", ammount: 0 });
      const response = await api.put(`/games/${gameId}`, requestBody);
      //setTable(response.data);
    } catch (error) {
      alert(`Something went wrong while calling: \n${handleError(error)}`);
    }
  }

  const check = async () => { //amount needed or automatic check?
    try {
      const requestBody = JSON.stringify({ move: "Check", ammount: 0 });
      const response = await api.put(`/games/${gameId}`, requestBody);
      //setTable(response.data);
    } catch (error) {
      alert(`Something went wrong while checking: \n${handleError(error)}`);
    }
  }

  const raise = async () => {
    if (!raiseAmount) {
      alert("Please enter an amount to raise.");
      toggleRaiseInput();
      
      return;
    }
    try {
      //alert("Raise amount: " + raiseAmount);
      const requestBody = JSON.stringify({ move: "Raise", amount: raiseAmount });
      const response = await api.put(`/games/${gameId}`, requestBody);
      setShowRaiseInput(false);
      //setTable(response.data);
    } catch (error) {
      alert(`Something went wrong while raising: \n${handleError(error)}`);
    }
  }

  const toggleRaiseInput = () => {
    setShowRaiseInput(!showRaiseInput); // Toggle the visibility of the input field
  };
  
  const fold = async () => {
    try {
      const requestBody = JSON.stringify({ move: "Fold", ammount: 0 });
      const response = await api.put(`/games/${gameId}`, requestBody);

      player.fold = true;
      //setTable(response.data);
    } catch (error) {
      alert(`Something went wrong while folding: \n${handleError(error)}`);
    }
  }

  let backCards = ( //stay hidden until player folds or game ends -> shows cards of enemy players
    <>
      <img className="table-player card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="Card 1" />
      <img className="table-player card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="Card 2" />
    </>
  );

  let playerCards = player?.cardsImage?.length > 0 ? (
    <>
      {player.cardsImage.map((card, index) => (
        <img key={index} className="table-player card" src={card} alt={`Card ${index + 1}`} />
      ))}
    </>
  ) : <p>No cards</p>;

  function formatMoney(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }

  function stopConfetti() {
    setTimeout(() => {
      setShowConfetti(false);
    }, 25000);
  }

  if (!table || !players || !player) {
    return <div>Loading...</div>; // Display loading state or spinner here
  }
  if(game.gameFinished){ //if game is finished show table the cards of the winning player and
    stopConfetti();
    return(
      <div>
        <img className="background" src={tableImage} alt="table" />
        <div className="table-wrapper">
          {game.winner.id === player.id && showConfetti && <Confetti />}
          <div className="table">
            <div className="table pot">
              <h1>Pot: {table.money || 0}</h1> {/* table.pot */}
            </div>
            <div className="table cards-container">
              {table?.openCardsImage?.length > 0 ? (
                table.openCardsImage.map((card, index) => (
                  <img key={index} className="table card" src={card} alt={`Card ${index}`} />
                ))
              ) : <p>No cards on table</p>}
            </div>
          </div>
          <div className="player-wrapper">
            <div className="table-player">
              <div className={player.id === game.winner.id ? "highlight-turn" :"table-player money"}>
                {player.id === game.winner.id && <h1>WINNER</h1>}
                <h1>{formatMoney(player.money)}</h1> {/* for higlihgting: style={{ color: turn ? 'yellow' : 'white' }} */}
              </div>

              <div className="table-player hand"  style={{ visibility: player.folded ? "hidden" : "visible" }}>  {/* change fold to player.fold */}
                {playerCards}
              </div>
            </div>
          </div>
        </div>

        <div className="enemy">
          {game.notFoldedPlayers
            .filter((enemy: Player) => enemy.id !== player.id)
            .map((enemy, index) => (
              <div className={enemyPosition(enemy)} key={enemy.id}>
                <div className={enemy.id === game.winner.id ? "highlight-turn" : "enemy info"}>
                  {enemy.id === game.winner.id && <h1>WINNER</h1>}
                  <div className="enemy username">{enemy.username}</div>
                  <div className="enemy money">{formatMoney(enemy.money)}</div>
                  {enemy.fold && <div className="enemy fold-status">Fold</div>}
                </div>
                <div className="enemy cards" style={{ visibility: enemy.folded ? "hidden" : "visible" }}>
                  {enemy.cardsImage && enemy.cardsImage.length > 0 ? (
                    <>
                      {enemy.cardsImage.map((card, index) => (
                        <img key={index} className="table-player card" src={card} alt={`Card ${index + 1}`} />
                      ))}
                    </>
                  ) : <p>No cards</p>}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <img className="background" src={tableImage} alt="table" />
        <div className="table-wrapper">
          <div className="table">
            <div className="table pot">
              <h1>Pot: {table.money || 0}</h1> {/* table.pot */}
            </div>
            <div className="table cards-container" >
              {table?.openCardsImage?.length > 0 ? (
                table.openCardsImage.map((card, index) => (
                  <img key={index} className="table card" src={card} alt={`Card ${index}`} />
                ))
              ) : <p>No cards on table</p>}
            </div>
          </div>
          <div className="player-wrapper">
            <div className="table-player">
              <div className={player.turn ? "highlight-turn" :"table-player money"}>
                <h1>{formatMoney(player.money)}</h1> {/* for higlihgting: style={{ color: turn ? 'yellow' : 'white' }} */}
              </div>

              <div className="table-player hand"  style={{ visibility: player.folded ? "hidden" : "visible" }}>  {/* change fold to player.fold */}
                {playerCards}
              </div>

              <div className="table-player actions">
                {showRaiseInput ? (
                  <div className="raise-wrapper">
                    <input
                      type="number"
                      style={{ width: "50%" }} // Inline style for demonstration
                      className="raiseInput"
                      value={raiseAmount}
                      onChange={(e) => setRaiseAmount(e.target.value)}
                      placeholder="Raise Pot to"
                    />
                    <button className="tickButton" onClick={raise}>✓</button>
                    <button className="cancelButton" onClick={() => setShowRaiseInput(false)}>X</button>

                  </div>
                ) : (
                  <>
                    <button className ="actions-button" onClick={fold} disabled={!player.turn}>Fold</button>
                    <button className ="actions-button" onClick={check} disabled={!player.turn}>Check</button> {/*disable button if no raise: disabled={!player.turn || raiseAmmount  !==0}  */}
                    <button className ="actions-button" onClick={call} disabled={!player.turn}>Call</button>  {/*disable button if no raise: disabled={!player.turn || raiseAmmount  ==0}  */}
                    <button className ="actions-button" onClick={toggleRaiseInput} disabled={!player.turn}>Raise</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="enemy">
          {players
            .filter((enemy: Player) => enemy.id !== player.id)
            .map((enemy, index) => (
              //<div className={`pos${index + 1}`} key={enemy.id}>
              <div className={enemyPosition(enemy)} key={enemy.id}>
                <div className={enemy.turn ? "highlight-turn" : "enemy info"}>
                  <div className="enemy username">{enemy.username}</div>
                  <div className="enemy money">{formatMoney(enemy.money)}</div>
                  {enemy.fold && <div className="enemy fold-status">Fold</div>}
                </div>
                <div className="enemy cards" style={{ visibility: enemy.folded ? "hidden" : "visible" }}>
                  {/*{!enemy.folded ? backCards : <p>Fold</p>} */}
                  {backCards}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

};

export default Table;