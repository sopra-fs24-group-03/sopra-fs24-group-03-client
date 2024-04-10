import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "../../views/Home";
import PropTypes from "prop-types";

const GameRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Home />} />

        <Route path="dashboard" element={<Home />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

      </Routes>
   
    </div>
  );
};
/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
