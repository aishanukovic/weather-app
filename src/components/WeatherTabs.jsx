import { useState } from 'react';
import "../styles/WeatherTabs.css";

const WeatherTabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || 0);

  return (
    <div className="weather-tabs-container">
      <div className="tabs-header">
        {children.map((child, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {children[activeTab]}
      </div>
    </div>
  );
};

export const Tab = ({ children }) => <div className="tab-pane">{children}</div>;

export default WeatherTabs;