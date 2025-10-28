import React from "react";

// Use PropTypes for type checking in JavaScript if desired (optional)
// import PropTypes from 'prop-types';

export const Card = ({ title, children, className }) => ( // Removed React.FC and interface
  <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 ${className || ""}`}>
    <h3 className="font-serif text-xl font-semibold mb-2">{title}</h3>
    <div>{children}</div>
  </div>
);

// Optional: Add PropTypes
// Card.propTypes = {
//  title: PropTypes.string.isRequired,
//  children: PropTypes.node,
//  className: PropTypes.string,
// };

export default Card;