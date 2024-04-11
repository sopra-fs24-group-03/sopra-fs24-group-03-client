import React, { useState } from "react";
import "styles/views/table/Table.scss";
//import "../../styles/views/Header.scss";
import tableImage from "./table_prov.jpg";

const Table = () => {
  
  return (
    <div>
      <img className="background" src={tableImage} alt="table" />      
      
      <div className="table-player">
        <h1>Credits: 1000</h1> {/* Replace $100 with actual player cash */}

        <div className="table-player cards">
          {/* Cards */}
          <img height="115%" src="https://deckofcardsapi.com/static/img/5S.png" alt="Card 1" />
          <img height="115%" src="https://deckofcardsapi.com/static/img/6H.png" alt="Card 2" />
        </div>

        <div className="table-player actions">
          {/* Player actions */}
          <button>Fold</button>
          <button>Call</button>
          <button>Raise</button>  
        </div>  
      </div>
        
    </div>
  );   
    
    
};

export default Table;