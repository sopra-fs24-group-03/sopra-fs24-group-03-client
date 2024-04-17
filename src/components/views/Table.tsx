import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import "styles/views/Table.scss";
import "../../styles/views/Header.scss";
import tableImage from "./table_prov.jpg";
import { User, TableType } from "types";
import {useNavigate, useParams} from "react-router-dom";


const Table = () => {
  const [turn, setTurn] = useState(true);
  const [user, setUser] = useState<User>(null);
  const [testFold, setTestFold] = useState(false);
  const { gameId } = useParams();
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [showRaiseInput, setShowRaiseInput] = useState(false);


  /* const tableFiller = () => {
    
  useEffect(() => {
    async function fetchTable() {
      try {
        const tableResp = await api.get("/table");
        setTable(tableResp.data);
        tableFiller();
      } catch (error) {
        alert(`Something went wrong while fetching the user: \n${error}`);
      }
    }
    fetchTable();
  }, []); */

  /*api put body: {"move": ---, "ammount": ---} */

  const call = async () => {
    try {
      const requestBody = JSON.stringify({ move: "Call", ammount: 0 });
      //setTable(response.data);
    } catch (error) {
      alert(`Something went wrong while calling: \n${handleError(error)}`);
    }
  }

  const raise = async (amount) => {
    if (!raiseAmount) {
      alert("Please enter an amount to raise.");
      toggleRaiseInput();
      return;
    }
      
    try {
      //const requestBody = JSON.stringify({ move: "Raise", ammount: amount });
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
      setTestFold(true);
      //setTable(response.data);
    } catch (error) {
      alert(`Something went wrong while folding: \n${handleError(error)}`);
    }
  }
  
  let cardsToShow = (
      <>
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/AS.png" alt="card1" /> {/* <img className="table card" src="table.card1" alt="card1" />}*/}
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/JD.png" alt="card2" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/0C.png" alt="card3" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card4" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card5" />
      </>
  );
  

  let playerCards = (
    <>
      <img className="table-player card" src="https://deckofcardsapi.com/static/img/5S.png" alt="Card 1" /> {/* player.card1*/ }
      <img className="table-player card" src="https://deckofcardsapi.com/static/img/6H.png" alt="Card 2" /> {/* player.card2*/ }
    </>
  );

  let enemyCards = (
      <>
        <img className="table-player card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="Card 1" />
        <img className="table-player card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="Card 2" />
      </>
    );

  const resetTurn = () => {
    setTurn(true);
    setTestFold(false);
  }

  const tablePositions = [ /* table positions for mapping of enemy players */
    "pos1",
    "pos2",
    "pos3",
    "pos4",
    "pos5",
    "pos6"
  ];

  return (
    <div>
      <img className="background" src={tableImage} alt="table" />      
      <div className="table-wrapper">
        <div className="table">
          <div className="table pot">
            <h1>$100</h1> {/* table.pot */}
            <button onClick={resetTurn}></button>
          </div>
          <div className="table cards-container">
            {cardsToShow}
          </div>
        </div>
        <div className="player-wrapper">
          <div className="table-player">
            <div className="table-player money">
              <h1>1000</h1> {/* for higlihgting: style={{ color: turn ? 'yellow' : 'white' }} */}
            </div>

            <div className="table-player hand"  style={{ visibility: testFold ? "hidden" : "visible" }}>  {/* change fold to player.fold */}            
              {playerCards} 
            </div>

            <div className="table-player actions" style={{ visibility: turn ? "visible" : "hidden" }}>
              {showRaiseInput ? (
                <div className="raise-wrapper">
                  <input
                    type="number"
                    style={{ width: "50%" }} // Inline style for demonstration
                    className="raiseInput"
                    value={raiseAmount}
                    onChange={(e) => setRaiseAmount(e.target.value)}
                    placeholder="Amount to Raise"
                  />
                  <button className="tickButton" onClick={raise}>✓</button>
                  <button className="cancelButton" onClick={() => setShowRaiseInput(false)}>X</button>

                </div>
              ) : (
                <>
                  <button className ="actions-button" onClick={fold}>Fold</button>
                  <button className ="actions-button" onClick={call}>Call</button>
                  <button className ="actions-button" onClick={toggleRaiseInput}>Raise</button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
      <div className="enemy">
        <div className="pos1">
          <div className="enemy info">
            <div className="enemy username">Player 1</div>
            <div className="enemy money">6000</div>
          </div>
          <div className="enemy cards">
              {enemyCards}
          </div>
        </div>
        <div className="pos2">
          <div className="enemy info">
            <div className="enemy username">Player 2</div>
            <div className="enemy money">5000</div>
          </div>
          <div className="enemy cards">
            {enemyCards}
          </div>
        </div>

        <div className="pos3">
          <div className="enemy info">
            <div className="enemy username">Player 3</div>
            <div className="enemy money">4000</div>
          </div>
          <div className="enemy cards">
            {enemyCards}
          </div>
        </div>

        <div className="pos4">
          <div className="enemy info">
            <div className="enemy username">Player 4</div>
            <div className="enemy money">3000</div>
          </div>
          <div className="enemy cards">
            {enemyCards}
          </div>
        </div>

        <div className="pos5">
          <div className="enemy info">
            <div className="enemy username">Player 5</div>
            <div className="enemy money">2000</div>
          </div>
          <div className="enemy cards">
            {enemyCards}
          </div>
        </div>

        <div className="pos6">
          <div className="enemy info">
            <div className="enemy username">Player 6</div>
            <div className="enemy money">1000</div>
          </div>
          <div className="enemy cards">
            {enemyCards}
          </div>
        </div>

          
      </div>
        
    </div>
  );   
    
    
};

export default Table;