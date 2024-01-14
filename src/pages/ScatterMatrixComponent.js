import React, { useEffect } from 'react';
// import educationData from '/public/education_data.json'; // Importing the JSON file

const backendURL = "http://127.0.0.1:5001"
// const backendURL = "https://data-viz-flask-eab5b9de2a8e.herokuapp.com"
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

const ScatterMatrixComponent = () => {
    useEffect(() => {
        const Plotly = require('plotly.js-dist');
        const plotElement = document.getElementById('scatter-matrix-plot');

        fetchDataFromBackend().then(response => {
            // Filter data for the year 2005
            const filteredData = response;
            // const filteredData = response.filter(item => item.year === 2005);

            const groupedData = filteredData.reduce((groups, item) => {
                const group = (groups[item.continent] || []);
                group.push(item);
                groups[item.continent] = group;
                return groups;
            }, {});

            // Create a trace for each continent
            const plotData = Object.entries(groupedData).map(([continent, items]) => ({
                type: 'splom',
                dimensions: [
                    { label: 'People Practicing <br> Open Defecation (%)', values: items.map(item => item.people_practicing_open_defecation) },
                    { label: 'Avg Years of <br> Schooling (years)', values: items.map(item => item.avg_years_of_schooling) },
                    { label: 'GDP per Capita <br> (USD)', values: items.map(item => item.gdp_per_capita) },
                    { label: 'Life Expectancy <br> (years)', values: items.map(item => item.life_expectancy) },
                    { label: 'Health Expenditure <br> (% of GDP)', values: items.map(item => item.health_expenditure) },
                    { label: 'Electric Power Consumption <br> (kWh per capita)', values: items.map(item => item.electric_power_consumption) }
                ],
                text: items.map(item => `Country: ${item.country}<br>Continent: ${item.continent}`),
                hovertemplate: '%{text}<br>x: %{x}<br>y: %{y}<extra></extra>',
                name: continent,
                diagonal: { visible: false },
                showupperhalf: false,
                marker: {
                    size: 7,
                    line: {
                        color: 'white',
                        width: 0.5
                    },
                    opacity: 0.8
                }
            }));

            const layout = {
                title: 'Scatter Matrix of Key Development Indicators by Country from 2005 to 2010',
                height: 1000,
                width: 1000,
                autosize: false,
                hovermode: 'closest',
                dragmode: 'select',
                paper_bgcolor: 'white',
                plot_bgcolor: 'white',
                xaxis: {
                    tickangle: -30,  // Adjust this value to slant the x-axis titles
                },
                legend: {
                    font: {
                        size: 18  // Adjust this value to increase or decrease the size of the legends
                    }
                },
            };

            Plotly.newPlot(plotElement, plotData, layout);

            return () => {
                Plotly.purge(plotElement);
            };

        })

    }, []);

    return <div id="scatter-matrix-plot" />;
};

export default ScatterMatrixComponent;