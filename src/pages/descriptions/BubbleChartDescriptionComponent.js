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
        Interactive Exploration of Education and Development Dynamics.
      </div>

      <p>
        We can see the dynamic visualization that shows the
        relationship between education metrics and development
        indicators across nations and time. 
      </p>

      <div style={headingStyle}>Key Features:</div>

      <ul style={listStyle}>
        <li>
          <strong>Dual-Axis Customization:</strong> You can select from a range of education metrics (average years of
          schooling, secondary school enrollment) and development indicators
          (life expectancy, GDP per capita, health expenditure, people
          practicing open defecation).
        </li>
        <li>
          <strong>Population-Weighted Bubbles:</strong> Each country is
          represented by a bubble, its size reflecting its population.
        </li>
        <li>
          <strong>Temporal Insights:</strong> Navigate through time seamlessly
          with the time slider. Observe changes in education and development
          metrics over the years, revealing patterns and trends.
        </li>
        <li>
          <strong>Animated Exploration:</strong> Hit play to initiate an
          animated journey through time, showcasing the evolving dynamics.
          You can also pause at any point for in-depth analysis.
        </li>
        <li>
          <strong>Detailed Information on Demand:</strong> Hover over
          individual bubbles to access detailed country-specific data.
        </li>
      </ul>

      <p>
        This visualization serves as a comprehensive tool for researchers,
        policymakers, and anyone interested in understanding the interplay
        between education and development on a global scale.
      </p>
    </div>
  );
};

export default BubbleChartDescriptionComponent;