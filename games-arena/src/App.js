import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import GameArena from './components/gamesArena.js';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <MuiThemeProvider>
                    <GameArena />
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
