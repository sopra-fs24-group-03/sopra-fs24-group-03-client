import React, { useState } from "react";
import "styles/views/Table.scss";
import "../../styles/views/Header.scss";
import tableImage from "./table_prov.jpg";

const Table = () => {
  const [roundCounter, setRoundCounter] = useState(0);

  let cardsToShow;
  switch (roundCounter) {
  case 0:
    cardsToShow = (
      <>
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card1" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card2" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card3" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card4" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card5" />
      </>
    );
    break;
  case 1:
    cardsToShow = (
      <>
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/AS.png" alt="card1" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/JD.png" alt="card2" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/0C.png" alt="card3" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card4" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card5" />
      </>
    );
    break;
  case 2:
    cardsToShow = (
      <>
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/AS.png" alt="card1" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/JD.png" alt="card2" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/0C.png" alt="card3" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/3H.png" alt="card4" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="card5" />
      </>
    );
    break;
  case 3:
    cardsToShow = (
      <>
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/AS.png" alt="card1" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/JD.png" alt="card2" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/0C.png" alt="card3" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/3H.png" alt="card4" />
        <img className="table card" src="https://www.deckofcardsapi.com/static/img/9D.png" alt="card5" />
      </>
    );
    break;

  default:
    cardsToShow = 0;
    break;
  }

  let playerCards = (
    <>
      <img src="https://deckofcardsapi.com/static/img/5S.png" alt="Card 1" />
      <img src="https://deckofcardsapi.com/static/img/6H.png" alt="Card 2" />
    </>
  );

  const handleRoundButtonClick = () => {
    setRoundCounter((prevRoundCounter) => (prevRoundCounter + 1) % 4);
  };

  return (
    <div>
      <img className="background" src={tableImage} alt="table" />      
      <div className="table-wrapper">
        <div className="table">
          <div className="table pot">
            <h1>Pot: $100</h1>
            <button onClick={handleRoundButtonClick}>Round</button>
          </div>
          <div className="table cards-container">
            {cardsToShow}
          </div>
        </div>
      </div>
      <div className="table-player">
        <div className="table-player money">
          <h1>1000</h1>   
        </div>

        <div className="table-player cards">
          {playerCards}
        </div>

        <div className="table-player actions">
          <button>Fold</button>
          <button>Call</button>
          <button>Raise</button>  
        </div>  
      </div>
        
    </div>
  );   
    
    
};

export default Table;