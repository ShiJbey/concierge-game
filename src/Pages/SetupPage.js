import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SetupPage.css';


function SetupPage() {
  const navigate = useNavigate();

  const goToTutorialPage = () => {
    navigate('/tutorial');
  };


  return (
    <div className="page-container">
      <h1>Setup Page</h1>
      <input type="text" placeholder="Enter your hotel name here" />
      <select>
    <option value="small">Small</option>
    <option value="medium">Medium</option>
    <option value="large">Large</option>
  </select>
  <button onClick={goToTutorialPage} className="navigate-button">Continue to game</button>
</div>
);
}

export default SetupPage;
