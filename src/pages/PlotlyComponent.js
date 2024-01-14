// PlotlyComponent.js
import { useEffect } from 'react'
import { csv } from 'd3-fetch'

export default function PlotlyComponent() {
  useEffect(() => {
    const Plotly = require('plotly.js-dist');
    // csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv')
    // fetch('data_test.json')
    fetch('education_data.json')
      .then(response => response.json())
      .then(data => {
        var lookup = {};
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
              marker: {size: []}
            };
          }
          return trace;
        }
  
        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          var trace = getData(datum.year, datum.continent);
          trace.text.push(datum.country);
          trace.id.push(datum.country);
          trace.x.push(datum.life_expectancy);
          trace.y.push(datum.gdp_per_capita);
          trace.marker.size.push(datum.population / 100);
          // trace.marker.size.push(datum.avg_years_of_schooling * 100000);
          // trace.x.push(datum.lifeExp);
          // trace.y.push(datum.gdpPercap);
          // trace.marker.size.push(datum.pop);
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
              sizeref: 2000
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
  
        var sliderSteps = [];
        for (i = 0; i < years.length; i++) {
          sliderSteps.push({
            method: 'animate',
            label: years[i],
            args: [[years[i]], {
              mode: 'immediate',
              transition: {duration: 300},
              frame: {duration: 300, redraw: false},
            }]
          });
        }
  
        var layout = {
          width: 1000, // Adjust as needed
          height: 800, // Adjust as needed
          xaxis: {
            title: 'Life Expectancy',
            range: [30, 85]
          },
          yaxis: {
            title: 'GDP per Capita',
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
            pad: {t: 87, r: 10},
            buttons: [{
              method: 'animate',
              args: [null, {
                mode: 'immediate',
                fromcurrent: true,
                transition: {duration: 300},
                frame: {duration: 500, redraw: false}
              }],
              label: 'Play'
            }, {
              method: 'animate',
              args: [[null], {
                mode: 'immediate',
                transition: {duration: 0},
                frame: {duration: 0, redraw: false}
              }],
              label: 'Pause'
            }]
          }],
          sliders: [{
            pad: {l: 130, t: 55},
            currentvalue: {
              visible: true,
              prefix: 'Year:',
              xanchor: 'right',
              font: {size: 20, color: '#666'}
            },
            steps: sliderSteps
          }]
        };
  
        Plotly.newPlot('myDiv', {
          data: traces,
          layout: layout,
          config: {showSendToCloud:true},
          frames: frames,
        });
      })
      .catch(err => console.error(err));
    }, []);

  return <div id="myDiv"></div> // This is where the plot will be rendered
}