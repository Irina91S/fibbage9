import React, { Component } from "react";
import Loader from './Loader'

import "./WaitingScreen.scss";

class WaitingScreen extends Component {
  render() {
    return (
      <div className="wrapper">
        <Loader/>
      </div>
    );
  }
}

export default WaitingScreen;
