import React from "react";
import "./App.css";

class Submit extends React.Component {
  render() {
    return (
      <div className="submit part">
        <h2>Submit</h2>
        <div onClick={this.props.onClick}>Submit</div>
        <p>{this.props.text}</p>
      </div>
    );
  }
}

export default Submit;
