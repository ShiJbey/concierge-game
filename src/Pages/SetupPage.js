import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SetupPage.css';

function SetupPage(props) {
    const [hotelName, setHotelName] = useState(props.game.Hotel.Name);
    const [hotelSize, setHotelSize] = useState('small');

    const navigate = useNavigate();

    const goToTutorialPage = () => {
        navigate('/tutorial');
    };

    const handleHotelNameChange = (event) => {
        console.log('Name change');
        props.game.Hotel.Name = event.target.value;
        setHotelName(event.target.value);
    };

    // const handleHotelSizeChange = (event) => {
    //     console.log('size change');

    //     setHotelSize(event.target.value);
    // };

    return (
        <div className="page-container">
            <h1>Setup Page</h1>
            <input
                type="text"
                placeholder="Enter your hotel name here"
                value={hotelName}
                onChange={(event) => handleHotelNameChange(event)}
            />
            {/* <select
                onChange={(event) => handleHotelSizeChange(event)}
                value={hotelSize}
            >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
            </select> */}
            <button onClick={goToTutorialPage} className="navigate-button">
                Continue to game
            </button>
        </div>
    );
}

export default SetupPage;
