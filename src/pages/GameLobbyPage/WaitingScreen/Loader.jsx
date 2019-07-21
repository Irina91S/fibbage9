import React from "react";

import Owl from "../../../shared/assets/AnimalsIllustrations/Owl";
import Panther from "../../../shared/assets/AnimalsIllustrations/Panther";
import Llama from "../../../shared/assets/AnimalsIllustrations/Llama";
import Tiger from "../../../shared/assets/AnimalsIllustrations/Tiger";
import Fish from "../../../shared/assets/AnimalsIllustrations/Fish";
import Sloth from "../../../shared/assets/AnimalsIllustrations/Sloth";

import "./WaitingScreen.scss";

const Loader = () => {
  return (
    <div className="container">
      <div className="circle">
        <div className="trio first">
          <div className="animal owl">
            <Owl />
          </div>
          <div className="animal panther">
            <Panther />
          </div>
          <div className="animal llama">
            <Llama />
          </div>
        </div>
        <div className="trio second">
          <div className="animal fish">
            <Fish />
          </div>
          <div className="animal sloth">
            <Sloth />
          </div>
          <div className="animal tiger">
            <Tiger />
          </div>
        </div>
      </div>
      <div className="info">
        Please be kind and wait, our hammster is working hard so we can process
        your bulshit
      </div>
    </div>
  );
};

export default Loader;
