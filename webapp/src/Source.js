import React from "react";
import "./App.css";

class Source extends React.Component {
  constructor(props) {
    super(props);
    this.handleSourceChange = this.handleSourceChange.bind(this);
  }

  handleSourceChange(ev) {
    this.props.onChange(ev.target.value);
  }

  render() {
    return (
      <div className="source part">
        <h2>Source data</h2>
        <select onChange={this.handleSourceChange} value={this.props.source}>
          {this.props.sources.map((source, index) => (
            <option value={index} key={index}>{source}</option>
          ))}
        </select>
      </div>
    );
  }
}

export default Source;
