import React, { useState } from "react";
import "styles/views/Table.scss";
import "../../styles/views/Header.scss";
import tableImage from "./table_prov.jpg";
import { User } from "types";


const Table = () => {
  const [fold, setFold] = useState(false);
  const [turn, setTurn] = useState(true);
  const [user, setUser] = useState<User>(null);

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

  async function foldCards() {
    setFold(!fold);
    setTurn(!turn);
  }

  const resetTurn = () => {
    setTurn(true);
    setFold(false);
  }


  let enemyCards = (
    <>
      <img className="table-player card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="Card 1" />
      <img className="table-player card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="Card 2" />
    </>
  );

  const tablePositions = [
    'position-1',
    'position-2',
    'position-3',
    'position-4',
    'position-5',
    'position-6'
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

            <div className="table-player hand" style={{ visibility: fold ? "hidden" : "visible" }}>  {/* change fold to player.fold */}            
              {playerCards} 
            </div>

            <div className="table-player actions" style={{ visibility: turn ? "visible" : "hidden" }}> {/* change turn to player.turn */}
              <button onClick={foldCards}>Fold</button>
              <button>Call</button>
              <button>Raise</button>  
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