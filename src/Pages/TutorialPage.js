import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TutorialPage.css';

function TutorialPage() {
    const navigate = useNavigate();

    const continueToGame = () => {
        navigate('/game'); // Replace with the actual game route or function
    };

    return (
        <div className="tutorial-container">
            <h1>Tutorial</h1>
            <p>Paragraph to welcome players.</p>
            <p>Brief intro about game.</p>
            <p>Rules and how to play.</p>
            <button onClick={continueToGame} className="continue-button">
                Continue to game
            </button>
            <div className="credits">Credits:</div>
        </div>
    );
}

export default TutorialPage;
