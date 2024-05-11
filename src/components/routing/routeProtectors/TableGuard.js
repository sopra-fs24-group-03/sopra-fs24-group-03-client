import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * <Outlet /> is rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
export const TableGuard = () => {
  const token = localStorage.getItem("token");
  const lobbyId = localStorage.getItem("lobbyId");
  const userId = localStorage.getItem("userId");
  if (token && lobbyId) {
    return <Outlet />;
  }
  else if (token) {
    return <Navigate to={`/home/${userId}`} replace />;
  }
  else {
    return <Navigate to="/login" replace />;
  }
};

TableGuard.propTypes = {
  children: PropTypes.node
};