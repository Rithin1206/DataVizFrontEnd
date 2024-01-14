import React, { useEffect } from 'react';
// import educationData from '/public/education_data.json'; // Importing the JSON file

const backendURL = "https://data-viz-flask-eab5b9de2a8e.herokuapp.com"
const x_value = "gdp_per_capita"
const y_value = "health_expenditure"
const year = 2010

async function fetchDataFromBackend() {
  const url = `${backendURL}`;
  // const response = fetch('education_data.json')
  const response = await fetch(url, { mode: 'cors' }).then(response => response.json()).catch(error => console.log(error));
  return response;
}

async function fetchAnnotationsFromBackend(plotType) {
  const url = `${backendURL}/${plotType}`;
  // const response = fetch('education_data.json')
  const response = await fetch(url, { mode: 'cors' }).then(response => response.json()).catch(error => console.log(error));
  return response;
}

async function saveAnnotationsToBackend(x, y, text) {
  const url = `${backendURL}/save_annotations`;
  const data = {
    plot_type: "scatterPlot_annotations",
    x_coordinate: x,
    y_coordinate: y,
    annotation: text,
    x_value,
    y_value
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(data)
  }).then(response => response.json()).catch(error => console.log(error));

  return response;
}

const ScatterComponent = () => {
  useEffect(() => {
    const Plotly = require('plotly.js-dist');
    const plotElement = document.getElementById('scatter-plot');

    fetchDataFromBackend().then(response => {
      // Extracting x and y values from the imported JSON data
      const xValues = response.map(item => item[x_value]);
      const yValues = response.map(item => item[y_value]);

      // Filter data for the year 2010
      // const filteredData = response.filter(item => item.year === year);
      const filteredData = response;

      // const groupedData = response.reduce((groups, item) => {
      const groupedData = filteredData.reduce((groups, item) => {
        const group = (groups[item.continent] || []);
        group.push(item);
        groups[item.continent] = group;
        return groups;
      }, {});

      // const plotData = [{
      //   x: xValues,
      //   y: yValues,
      //   mode: 'markers',
      //   type: 'scatter',
      //   marker: { size: 8 },
      // }];

      // Create a trace for each continent
      const plotData = Object.entries(groupedData).map(([continent, items]) => ({
        x: items.map(item => item[x_value]),
        y: items.map(item => item[y_value]),
        mode: 'markers',
        type: 'scatter',
        marker: { 
          size: 12,  // Increase marker size
          opacity: 0.7  // Add some transparency
        },
        name: continent,  // This will be used for the legend
        text: items.map(item => `Country: ${item.country}<br>Continent: ${item.continent}<br>Coordinates: (${item[x_value]}, ${item[y_value]})`),  // Text to show on hover
        hovertemplate: '%{text}<extra></extra>',  // Custom hover template
      }));

      const layout = {
        width: 800,
        height: 600,
        title: 'Scatter Plot of Health expenditure vs GPD per capita for all countries from 2005 to 2010',
        xaxis: { 
          title: 'GDP per Capita',
          gridcolor: 'lightgrey',  // Add grid lines
          zerolinecolor: 'grey',  // Add a line for x = 0
        },
        yaxis: { 
          title: 'Health Expenditure',
          gridcolor: 'lightgrey',  // Add grid lines
          zerolinecolor: 'grey',  // Add a line for y = 0
        },
        annotations: [],
        paper_bgcolor: 'white',  // Change plot background color
        plot_bgcolor: 'white',  // Change plot area background color
      };

      const addClickListener = () => {
        plotElement.on('plotly_click', function (data) {
          const x = data.points[0].x;
          const y = data.points[0].y;

          // Prompt the user to enter the annotation text
          const text = prompt('Enter the annotation text:');

          // If the text is not empty, add the annotation
          if (text) {
            layout.annotations.push({
              x: x,
              y: y,
              text: text,
              showarrow: true,
              ax: 20,  // x offset
              ay: -50, // y offset
            });

            // Redraw the plot with the new annotation
            Plotly.newPlot(plotElement, plotData, layout, {
              displayModeBar: true,
              modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
            });

            // Save the new annotation to the backend
            saveAnnotationsToBackend(x, y, text).then(response => {
              console.log(response); // Log the response from the backend
            }).catch(error => console.log(error));
          }

          // Re-attach the click event listener
          addClickListener();
        });
      };

      // Fetch annotations from backend
      fetchAnnotationsFromBackend('annotated_scatter_points').then(response => {
        // Map the annotations to the format expected by Plotly
        console.log("check", response)

        // Initialize annotations as an empty array
        let annotations = [];

        // Iterate over the response array
        for (let item of response) {
          // Create an annotation object for each item
          item = item.annotations
          let annotation = {
            x: item.scatterPlot_annotations.x_coordinate,
            y: item.scatterPlot_annotations.y_coordinate,
            text: item.scatterPlot_annotations.annotation,
            showarrow: true,
            ax: 20,  // x offset
            ay: -50, // y offset
          };

          // Push the annotation object to the annotations array
          annotations.push(annotation);
        }

        // Add fetched annotations to layout
        layout.annotations = annotations;

        // Render the plot with annotations
        Plotly.newPlot(plotElement, plotData, layout, {
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
        });

        // Add a click event listener to the plot
        addClickListener();
      }).catch(error => console.log(error));

      Plotly.newPlot(plotElement, plotData, layout, {
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
      });

      // Add a click event listener to the plot
      addClickListener();

      return () => {
        Plotly.purge(plotElement);
      };

    })

  }, []);

  return <div id="scatter-plot" />;
};

export default ScatterComponent;