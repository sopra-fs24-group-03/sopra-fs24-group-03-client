import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

export const LoginGuard = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Check if both token and userId are available in localStorage
  if (token && userId) {
    // Redirect to the home page of the user using the userId from localStorage
    return <Navigate to={`/home/${userId}`} replace />;
  }

  // If no token or userId, render the outlet which will show the login or register components
  if (!token || !userId) {
    return <Outlet />;
  }
};

LoginGuard.propTypes = {
  children: PropTypes.node
};
