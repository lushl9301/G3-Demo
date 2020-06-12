import React from "react";
import "./App.css";

class Layer extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleLayerClick = this.handleLayerClick.bind(this);
    this.handleLayerChange = this.handleLayerChange.bind(this);
  }

  handleButtonClick() {
    this.props.onLayerClick(this.props.layer);
  }

  handleLayerClick() {
    if (!this.props.onLayerChange) {
      this.handleButtonClick();
    }
  }

  handleLayerChange(name) {
    return (function (ev) {
      const value = ev.target.value;
      const newParams = {...this.data.params, [name]: value};
      this.props.onLayerChange(this.props.layer, newParams);
    }).bind(this);
  }

  render() {
    this.data = this.props.layer.data;
    return (
      <div className="layer" onClick={this.handleLayerClick}>
        <img src={require(`./images/${this.data.layerNum}_${this.props.suffix}`)} alt={this.data.name} />
        <span>{this.data.name}</span>
        {this.props.onLayerChange && Object.entries(this.data.params).map(([name, value]) => (
          <label key={name}>
            {name}
            <input onChange={this.handleLayerChange(name)} value={value} />
          </label>
        ))}
        <div onClick={this.handleButtonClick}>{this.props.hover}</div>
      </div>
    );
  }
}

export default Layer;
