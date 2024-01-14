import React from 'react';

const BubbleChartDescriptionComponent = () => {
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
    textAlign: 'left',
    fontSize: '22px'
  };

  const headingStyle = {
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const listStyle = {
    listStyleType: 'square',
    marginLeft: '20px',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        Interactive Correlation Exploration of Development Indicators.
      </div>

      <p>
        We can see the dynamic visualization that shows the
        Correlation between various Development Indicators across nations and time. 
      </p>
      <br></br>

      <div style={headingStyle}>Key Features:</div>

      <ul style={listStyle}>
        <li>
          <strong>Radio button interaction:</strong> Choose any continent using radio button,
          which will show user the correlation information for any specific continent.
        </li>
        <li>
          <strong>Detailed Information on Demand:</strong> Hover over
          individual square to access detailed indicator-specific data.
        </li>
      </ul>

      <p>
        It is important to note that correlations do not necessarily indicate causation. 
        However, the heatmap can be used to identify potential relationships between 
        the variables through data, that can be further explored through research.
      </p>
    </div>
  );
};

export default BubbleChartDescriptionComponent;