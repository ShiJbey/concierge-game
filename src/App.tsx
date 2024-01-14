import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TitlePage from './Pages/TitlePage';
import SetupPage from './Pages/SetupPage';
import TutorialPage from './Pages/TutorialPage';
import ConciergeDashboard from './Components/ConciergeDashboard';
import { ConciergeGame } from './concierge';

type AppProps = {
    game: ConciergeGame;
};

const App: React.FC<AppProps> = (props) => {
    const handleSetupChange = (data: any): void => {
        console.log(data);
    };

    return (
        <Router>
            <div className="w-100 h-100 position-relative">
                <Routes>
                    <Route path="/" element={<TitlePage />} />
                    <Route
                        path="/setup"
                        element={<SetupPage game={props.game} />}
                    />
                    <Route path="/tutorial" element={<TutorialPage />} />
                    <Route
                        path="/game"
                        element={<ConciergeDashboard game={props.game} />}
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
