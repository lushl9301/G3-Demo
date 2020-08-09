import React from "react";
import Layer from "./Layer";
import "./App.css";

class LayerList extends React.Component {
  render() {
    return (
      <div className="layer-list part">
        <h2>{this.props.title}</h2>
        {this.props.layers.map(layer => (
          <Layer onLayerClick={this.props.onLayerClick}
                 onLayerChange={this.props.onLayerChange}
                 suffix={this.props.suffix}
                 hover={this.props.hover}
                 layer={layer}
                 key={layer.id} />
        ))}
      </div>
    );
  }
}

export default LayerList;
