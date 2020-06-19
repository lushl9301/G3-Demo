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
    this.handleLayerChange = this.handleLayerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {source: 0, layers: [], nextLayerId: 0};
  }

  copyData(data) {
    return {layerNum: data.layerNum, name: data.name, params: {...data.params}};
  }

  availableSources = ["citeseer", "cora", "pubmed"];
  possibleLayers = [
    {layerNum: 0, name: "Dropout", params: {rate: "0.5"}},
    {layerNum: 1, name: "SparseMul", params: {height: "in_dim", width: "16", decay: "true"}},
    {layerNum: 2, name: "GraphSum"},
    {layerNum: 3, name: "ReLU"},
    {layerNum: 4, name: "MatMul", params: {height: "16", width: "out_dim", decay: "false"}},
    {layerNum: 5, name: "Output"},
    {layerNum: 6, name: "SoftMax"},
    {layerNum: 7, name: "MaxPool"}
  ];
  availableLayers = this.possibleLayers.map((data, index) => (
    {id: index, data: this.copyData(data)}
  ));

  handleSourceChange(index) {
    this.setState({source: index});
  }

  handleLayerAdd(layer) {
    this.setState({
      layers: this.state.layers.concat({id: this.state.nextLayerId, data: this.copyData(layer.data)}),
      nextLayerId: this.state.nextLayerId + 1
    });
  }

  handleLayerRemove(layer) {
    this.setState({
      layers: this.state.layers.filter(l => l.id !== layer.id)
    });
  }

  handleLayerChange(layerToChange, newParams) {
    const newLayer = {id: layerToChange.id, data: this.copyData(layerToChange.data)};
    newLayer.data.params = newParams;

    this.setState({
      layers: this.state.layers.map(layer => layer.id === layerToChange.id ? newLayer : layer)
    });
  }

  handleSubmit() {
    const params = {
      dataset: this.availableSources[this.state.source],
      layers: this.state.layers.map(layer => layer.data)
    };
    const input = JSON.stringify(params);
    this.setState({text: input});

    const callback = (function () {
      if (xhr.readyState === 4) {
        this.setState({text: this.state.text + "\n" + xhr.responseText});
        console.log(xhr);
      }
    }).bind(this);

    const xhr = new XMLHttpRequest(),
      url = "http://xtrap100.d2.comp.nus.edu.sg:4002/";
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = callback;
    xhr.send(input);
  }

  render() {
    return (
      <div className="App">
        <Source source={this.state.source} onChange={this.handleSourceChange} sources={this.availableSources} />
        <LayerList layers={this.state.layers} onLayerClick={this.handleLayerRemove} suffix="2.png" hover="×" title="Current layers" onLayerChange={this.handleLayerChange} />
        <Submit onClick={this.handleSubmit} text={this.state.text} />
        <LayerList layers={this.availableLayers} onLayerClick={this.handleLayerAdd} suffix="1.jpg" hover="+" title="Available layers" />
      </div>
    );
  }
}

export default App;
