import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import { ConciergeGame } from './concierge';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const game = new ConciergeGame({ numRooms: 10 });

game.Tick();

root.render(
    <React.StrictMode>
        <App game={game} />
    </React.StrictMode>
);
