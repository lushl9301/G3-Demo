import React from "react";
import "./App.css";

class Source extends React.Component {
  constructor(props) {
    super(props);
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handlePresetChange = this.handlePresetChange.bind(this);
  }

  handleSourceChange(ev) {
    this.props.onSourceChange(ev.target.value);
  }

  handlePresetChange(ev) {
    this.props.onPresetChange(ev.target.value);
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
        <h2>Preset layers</h2>
        <select onChange={this.handlePresetChange} value={this.props.preset}>
          {this.props.presetLayers.map((preset, index) => (
            <option value={index} key={index}>{preset}</option>
          ))}
        </select>
      </div>
    );
  }
}

export default Source;
