import React, { Component } from "react";

class WaitingScreen extends Component {
  render() {
    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: 'blue', zIndex: '100', position: 'absolute', top: '0'}}>
            <div style={{ color: 'white', margin: 'auto', width: '80%', height: '100%'}}>Wait for all players</div>
        </div>
    );
  }
}

export default WaitingScreen;
