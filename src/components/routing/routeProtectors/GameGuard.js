import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * RouteProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * This guard checks if the user is authenticated (i.e., both a token and a userId are stored in local storage)
 * If both are present, <Outlet /> is rendered, allowing the user to access the protected content.
 * If either is missing, the component redirects to the /login screen.
 * @Guard
 * @param props
 */
export const GameGuard = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Check both token and userId to confirm user authentication
  if (token && userId) {
    // User is authenticated; allow access to route's component
    return <Outlet />;
  }

  // Redirect to login if either token or userId is missing
  return <Navigate to="/login" replace />;
};

GameGuard.propTypes = {
  children: PropTypes.node
};
