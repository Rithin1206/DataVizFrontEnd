// PlotlyComponent.js
import { useEffect, useState } from 'react'

const dropdownStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '30%',
};

const labelStyle = {
  width: '20%',
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  // backgroundColor: '#f1f1f1',
  fontSize: '16px',
  margin: '5px 0',
};

const xaxisvalues = ['avg_years_of_schooling','secondary_enroll'];
const yaxisvalues = ['life_expectancy', 'gdp_per_capita', 'health_expenditure', 'people_practicing_open_defecation'];

// construct data here
async function fetchData() {
  try {
    let jsonData = await fetchDataFromBackend();
    // Now jsonData is available, you can construct rangeMappingX or call a function that uses it
    let rangeMappingX = constructRangeMapping(jsonData);
    return [jsonData, rangeMappingX];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const titleMapping = {
  'avg_years_of_schooling': 'Average years of Schooling (in years)',
  'secondary_enroll': 'Secondary School Enrollment (in percentage of school aged population)',
  'life_expectancy': 'Life expectancy (in years)',
  'gdp_per_capita': 'GDP per capita (in USD)',
  'health_expenditure': 'Health Expenditure (in percentage of GDP)',
  'people_practicing_open_defecation': 'Open Defecation (in percentage of population)'
};

function constructRangeMapping(jsonData) {
  const rangeMappingX = {};
  xaxisvalues.forEach((axis) => {
    rangeMappingX[axis] = [Math.min(...jsonData.map(entry => entry[axis])), Math.max(...jsonData.map(entry => entry[axis]))];
  });

  const rangeMappingY = {};
  yaxisvalues.forEach((axis) => {
    rangeMappingY[axis] = [Math.min(...jsonData.map(entry => entry[axis])), Math.max(...jsonData.map(entry => entry[axis]))];
  });
  return rangeMappingY;
}


async function fetchDataFromBackend() {
  const url = 'https://data-viz-flask-eab5b9de2a8e.herokuapp.com';
  // const response = fetch('education_data.json')
  const response = await fetch(url, { mode: 'cors' }).then(response => response.json()).catch(error => console.log(error));
  return response;
}

const ColumnToUseForBubbleSize = 'population';

export default function PlotlyComponentWithDropDown() {
  const [xaxis, setxaxis] = useState('avg_years_of_schooling');
  const [yaxis, setyaxis] = useState('life_expectancy');
  useEffect(() => {
    const Plotly = require('plotly.js-dist');
    fetchData()
      .then((dataAndRangeMap) => {
        var lookup = {};
        data = dataAndRangeMap[0];
        let rangeMappingX = dataAndRangeMap[1];
        console.log('data: ', data);
        function getData(year, continent) {
          var byYear, trace;
          if (!(byYear = lookup[year])) {
            byYear = lookup[year] = {};
          }
          if (!(trace = byYear[continent])) {
            trace = byYear[continent] = {
              x: [],
              y: [],
              id: [],
              text: [],
              marker: { size: [] }
            };
          }
          return trace;
        }

        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          var trace = getData(datum.year, datum.continent);
          trace.text.push(datum.country);
          trace.id.push(datum.country);
          trace.x.push(datum[xaxis]);
          trace.y.push(datum[yaxis]);
          trace.marker.size.push(datum[ColumnToUseForBubbleSize]);
        }

        var years = Object.keys(lookup);
        var firstYear = lookup[years[0]];
        var continents = Object.keys(firstYear);

        var traces = [];
        for (i = 0; i < continents.length; i++) {
          var data = firstYear[continents[i]];
          traces.push({
            name: continents[i],
            x: data.x.slice(),
            y: data.y.slice(),
            id: data.id.slice(),
            text: data.text.slice(),
            mode: 'markers',
            marker: {
              size: data.marker.size.slice(),
              sizemode: 'area',
              sizeref: 100000
            }
          });
        }

        var frames = [];
        for (i = 0; i < years.length; i++) {
          frames.push({
            name: years[i],
            data: continents.map(function (continent) {
              return getData(years[i], continent);
            })
          })
        }

        console.log("frames", frames);

        var sliderSteps = [];
        for (i = 0; i < years.length; i++) {
          sliderSteps.push({
            method: 'animate',
            label: years[i],
            args: [[years[i]], {
              mode: 'immediate',
              transition: { duration: 300 },
              frame: { duration: 300, redraw: false },
            }]
          });
        }

        var layout = {
          width: 900, // Adjust as needed
          height: 900, // Adjust as needed
          title: 'Impact of Education on Development Indicators',
          xaxis: {
            title: titleMapping[xaxis],
            range: rangeMappingX[xaxis]
          },
          yaxis: {
            title: titleMapping[yaxis],
            type: 'log'
          },
          hovermode: 'closest',
          updatemenus: [{
            x: 0,
            y: 0,
            yanchor: 'top',
            xanchor: 'left',
            showactive: false,
            direction: 'left',
            type: 'buttons',
            pad: { t: 87, r: 10 },
            buttons: [{
              method: 'animate',
              args: [null, {
                mode: 'immediate',
                fromcurrent: true,
                transition: { duration: 300 },
                frame: { duration: 500, redraw: false }
              }],
              label: 'Play'
            }, {
              method: 'animate',
              args: [[null], {
                mode: 'immediate',
                transition: { duration: 0 },
                frame: { duration: 0, redraw: false }
              }],
              label: 'Pause'
            }]
          }],
          sliders: [{
            pad: { l: 130, t: 55 },
            currentvalue: {
              visible: true,
              prefix: 'Year:',
              xanchor: 'right',
              font: { size: 20, color: '#666' }
            },
            steps: sliderSteps
          }]
        };

        console.log('traces: ', traces);

        // Add annotations to the layout
        var annotations = [{
          x: 4.9,
          y: 58.81314,
          text: "My Home"
        }]
        // layout.annotations = annotations.map(annotation => ({
        //   x: annotation.x,
        //   y: annotation.y,
        //   text: annotation.text,
        //   showarrow: true,
        //   ax: 20,  // x offset
        //   ay: -30, // y offset
        // }));

        Plotly.newPlot('myDiv', {
          data: traces,
          layout: layout,
          config: { 
            showSendToCloud: false,
            displayModeBar: true,
            modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d']
          },
          frames: frames
        });
      })
      .catch(err => console.error(err));
  }, [xaxis, yaxis]);

  return (
    <div className="container">
      <div id="myDiv">
        {/* Your visualization component can go here */}
      </div>

      {/* X-axis dropdown */}
      <div className="axis-dropdown">
        <span className="axis-label">X axis: </span>
        <select
          id="xAxisSelect"
          onChange={(e) => setxaxis(e.target.value)}
          className="axis-select"
        >
          {xaxisvalues.map((value) => (
            <option key={value} value={value}>
              {value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Y-axis dropdown */}
      <div className="axis-dropdown">
        <span className="axis-label">Y axis: </span>
        <select
          id="yAxisSelect"
          onChange={(e) => setyaxis(e.target.value)}
          className="axis-select"
        >
          {yaxisvalues.map((value) => (
            <option key={value} value={value}>
              {value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>
    </div>
    )
}