import React from "react";
import "./App.css";

class Layer extends React.Component {
  constructor(props) {
    super(props);
    this.handleLayerClick = this.handleLayerClick.bind(this);
  }

  handleLayerClick() {
    this.props.onLayerClick(this.props.layer);
  }

  render() {
    return (
      <div className="layer" onClick={this.handleLayerClick}>
        <img src={require(`./images/${this.props.layer.layerNum}_${this.props.suffix}`)} alt={this.props.layer.name} />
        <span>{this.props.layer.name}</span>
        <div>{this.props.hover}</div>
      </div>
    );
  }
}

export default Layer;
