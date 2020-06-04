import React from "react";
import Source from "./Source"
import LayerList from "./LayerList"
import Submit from "./Submit"
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleLayerAdd = this.handleLayerAdd.bind(this);
    this.handleLayerRemove = this.handleLayerRemove.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {source: 0, layers: [], nextLayerId: 0};
  }

  availableSources = ["Select a source", "a", "b", "c", "d", "e"];
  availableLayerNames = ["Dropout", "SparseMul", "GraphSum", "ReLU", "MatMul", "Output", "SoftMax", "MaxPool"];
  availableLayers = this.availableLayerNames.map((name, index) => {
    return {id: index, layerNum: index, name: name};
  });

  handleSourceChange(index) {
    this.setState({source: index});
  }

  handleLayerAdd(layer) {
    this.setState({
      layers: this.state.layers.concat({id: this.state.nextLayerId, layerNum: layer.layerNum, name: layer.name}),
      nextLayerId: this.state.nextLayerId + 1
    });
  }

  handleLayerRemove(layer) {
    this.setState({
      layers: this.state.layers.filter(l => l.id !== layer.id)
    });
  }

  handleSubmit() {
    const params = {
      dataset: this.availableSources[this.state.source],
      layers: this.state.layers.map(layer => layer.name)
    };
    alert(JSON.stringify(params));
  }

  render() {
    return (
      <div className="App">
        <Source source={this.state.source} onChange={this.handleSourceChange} sources={this.availableSources} />
        <LayerList layers={this.state.layers} onLayerClick={this.handleLayerRemove} suffix="2.png" hover="×" title="Current layers" />
        <Submit onClick={this.handleSubmit} />
        <LayerList layers={this.availableLayers} onLayerClick={this.handleLayerAdd} suffix="1.jpg" hover="+" title="Available layers" />
      </div>
    );
  }
}

export default App;
