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
      const newData = {...this.layer.data, [name]: value};
      this.props.onLayerChange(this.layer, newData);
    }).bind(this);
  }

  render() {
    this.layer = this.props.layer;
    return (
      <div className="layer" onClick={this.handleLayerClick}>
        <img src={require(`./images/${this.layer.layerNum}_${this.props.suffix}`)} alt={this.layer.name} />
        <span>{this.layer.name}</span>
        {this.props.onLayerChange && this.layer.params.map(par => (
          <label key={par.name}>
            {par.name}
            <input onChange={this.handleLayerChange(par.name)} value={this.layer.data[par.name]} />
          </label>
        ))}
        <div onClick={this.handleButtonClick}>{this.props.hover}</div>
      </div>
    );
  }
}

export default Layer;
