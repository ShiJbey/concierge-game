import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TitlePage.css';




function TitlePage() {
  const navigate = useNavigate();

  const goToSetupPage = () => {
    navigate('/setup');
  };

  return (
    <div className="title-page">
      <h1>Concierge</h1>
      <button onClick={goToSetupPage}>Start</button>
    </div>
  );
}

export default TitlePage;
