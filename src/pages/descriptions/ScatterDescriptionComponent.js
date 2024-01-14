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
                Interactive Exploration of GDP Per capita and Health Expenditure.
            </div>

            <p>
                We can see the dynamic visualization that shows the
                relationship between GDP Per capita and Health Expenditure across nations and time.
            </p>
            <br></br>
            <div style={headingStyle}>Key Features:</div>

            <ul style={listStyle}>
                <li>
                    <strong>Annotations feature:</strong> User can mark and annotate multiple data points,
                    which will persist through the time.
                </li>
                <li>
                    <strong>Detailed Information on Demand:</strong> Hover over
                    individual data points to access detailed country-specific data.
                </li>
            </ul>

            <p>
                This visualization the scatter plot suggests that a country's wealth 
                is a strong predictor of its health expenditure across the global.
            </p>
        </div>
    );
};

export default BubbleChartDescriptionComponent;