import React, { useEffect, useState } from 'react';

const backendURL = "https://data-viz-flask-eab5b9de2a8e.herokuapp.com"
const attributes = ["gdp_per_capita", "avg_years_of_schooling", "life_expectancy", "beer_consumption_per_capita", "forest_area"];
const continents = ["All", "Africa", "Asia", "Europe", "Oceania", "North America", "South America"];  // Add other continents as needed

async function fetchDataFromBackend() {
  const url = `${backendURL}`;
  const response = await fetch(url, { mode: 'cors' }).then(response => response.json()).catch(error => console.log(error));
  return response;
}

const HeatMapComponent = () => {
  const [selectedContinent, setSelectedContinent] = useState(continents[0]);  // Initialize with the first continent
  const [loading, setLoading] = useState(true);  // Initialize loading state

  useEffect(() => {
    const Plotly = require('plotly.js-dist');
    const plotElement = document.getElementById('heatmap');

    setLoading(true);  // Set loading state to true when fetching data

    fetchDataFromBackend().then(response => {
      // Filter data based on the selected continent
      const filteredData = selectedContinent === "All" ? response : response.filter(item => item.continent === selectedContinent);

      const correlationData = attributes.map(attr1 =>
        attributes.map(attr2 => {
          const x = filteredData.map(item => item[attr1]);
          const y = filteredData.map(item => item[attr2]);
          const sumX = x.reduce((acc, val) => acc + val, 0);
          const sumY = y.reduce((acc, val) => acc + val, 0);
          const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
          const n = x.length;
          const correlation = (n * sumXY - sumX * sumY) /
            Math.sqrt((n * x.reduce((acc, val) => acc + val ** 2, 0) - sumX ** 2) *
              (n * y.reduce((acc, val) => acc + val ** 2, 0) - sumY ** 2));

          return correlation;
        })
      );

      const heatmapData = {
        z: correlationData,
        x: attributes,
        y: attributes,
        type: 'heatmap',
        colorscale: 'Viridis',
        colorbar: {
          title: 'Correlation',
        },
      };

      const layout = {
        width: 1000,
        height: 800,
        title: 'Correlation Heatmap',
        xaxis: {
          title: 'Attributes',
          domain: [0.15, 0.95],
        },
        yaxis: {
          title: 'Attributes',
          domain: [0.1, 0.9],
        },
      };

      Plotly.newPlot(plotElement, [heatmapData], layout);
      setLoading(false);  // Set loading state to false after rendering the heatmap
    })

    return () => {
      Plotly.purge(plotElement);
    };
  }, [selectedContinent]);  // Add selectedContinent as a dependency

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div id="heatmap" style={{ position: 'relative', width: '1000px', height: '800px' }}>
        {loading && <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px' }}>Loading...</div>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2%' }}>
        {continents.map(continent => (
          <label key={continent} style={{ fontSize: '20px', margin: '5px' }}>
            <input
              type="radio"
              value={continent}
              checked={selectedContinent === continent}
              onChange={() => setSelectedContinent(continent)}
              style={{ marginRight: '10px', transform: 'scale(1.5)' }}
            />
            {continent}
          </label>
        ))}
      </div>
    </div>
  );
};

export default HeatMapComponent;