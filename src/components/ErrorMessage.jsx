import React from "react";
import "../styles/ErrorMessage.css";

const ErrorMessage = ({ message, type = "error", onRetry = null }) => {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-svg-icon">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case "info":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-svg-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case "network":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-svg-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        );
      case "validation":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-svg-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-svg-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
    }
  };

  const getTip = () => {
    if (message.includes("not found")) {
      return "Try checking your spelling or search for a different location.";
    } else if (message.includes("network") || message.includes("failed to fetch")) {
      return "Check your internet connection and try again.";
    } else if (message.includes("API key")) {
      return "There's an issue with our weather service. Please try again later.";
    } else {
      return "Please try again or search for a different location.";
    }
  };

  return (
    <div className={`error-container ${type}`} role="alert">
      <div className="error-icon">{getIcon()}</div>
      <div className="error-content">
        <h3 className="error-title">
          {type === "network"
            ? "Connection Error"
            : type === "validation"
            ? "Invalid Input"
            : type === "warning"
            ? "Warning"
            : type === "info"
            ? "Information"
            : "Weather Data Error"}
        </h3>
        <p className="error-message">{message}</p>
        <p className="error-tip">{getTip()}</p>
        {onRetry && (
          <button className="error-retry-button" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;