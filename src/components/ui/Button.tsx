import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/Button.scss";

export const Button = props => {
  const [isCooldown, setIsCooldown] = useState(false);

  const handleClick = useCallback(
    (event) => {
      if (!isCooldown && !props.disabled) {
        props.onClick && props.onClick(event);
        setIsCooldown(true);
      }
    },
    [isCooldown, props]
  );

  useEffect(() => {
    let timer;
    if (isCooldown) {
      timer = setTimeout(() => {
        setIsCooldown(false);
      }, 2000);
    }
    
    return () => clearTimeout(timer);
  }, [isCooldown]);

  return (
    <button
      {...props}
      onClick={handleClick}
      style={{ width: props.width, ...props.style }}
      className={`primary-button ${props.className}`}
      disabled={props.disabled || isCooldown}
    >
      {props.children}
    </button>
  );
};

Button.propTypes = {
  width: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  style: {},
  className: "",
  disabled: false,
};
