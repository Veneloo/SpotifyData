import React from 'react';
import Heatmap from './components/Heatmap';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Spotify Listening Heatmap 2024</h1>
      </header>
      <main>
        <Heatmap />
      </main>
    </div>
  );
}

export default App;
