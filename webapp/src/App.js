import React from "react";
import Source from "./Source"
import LayerList from "./LayerList"
import Submit from "./Submit"
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handlePresetChange = this.handlePresetChange.bind(this);
    this.handleLayerAdd = this.handleLayerAdd.bind(this);
    this.handleLayerRemove = this.handleLayerRemove.bind(this);
    this.handleLayerChange = this.handleLayerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLayer = this.getLayer.bind(this);
    this.castParams = this.castParams.bind(this);
    this.state = {source: 0, layers: [], nextLayerId: 0};
  }

  availableSources = ["citeseer", "cora", "pubmed"];
  availablePresetNames = ["No preset layers", "Preset"];
  possibleLayers = [
    {layerNum: 0, name: "Dropout", data: {name: "dropout"}, params: [
        {name: "rate", type: "frac", default: 0.5}]},
    {layerNum: 1, name: "SparseMul", data: {name: "sprmul"}, params: [
        {name: "height", type: "dim", default: "in_dim"},
        {name: "width", type: "dim", default: 16},
        {name: "decay", type: "bool", default: true}]},
    {layerNum: 2, name: "GraphSum", data: {name: "graph_sum"}},
    {layerNum: 3, name: "ReLU", data: {name: "relu"}},
    {layerNum: 4, name: "MatMul", data: {name: "mat_mul"}, params: [
        {name: "height", type: "dim", default: 16},
        {name: "width", type: "dim", default: "out_dim"},
        {name: "decay", type: "bool", default: false}]},
    {layerNum: 5, name: "Output", data: {name: "output"}},
    {layerNum: 6, name: "SoftMax", data: {name: "softmax"}},
    {layerNum: 7, name: "MaxPool", data: {name: "maxpool"}},
    {layerNum: 8, name: "Input", data: {name: "input"}}
  ];

  copyLayer(layer, id = layer.id) {
    return {...layer, id: id, params: layer.params || [], data: {...layer.data}};
  }

  getLayer(name, id) {
    const layer = this.copyLayer(this.possibleLayers.find(l => l.name === name), id);
    this.resetLayerParams(layer);
    return layer;
  }

  resetLayerParams(layer) {
    layer.params.forEach(param => layer.data[param.name] = param.default ?? "");
  }

  availableLayers = this.possibleLayers
    .filter(layer => !["Output", "Input"].includes(layer.name))
    .map(this.copyLayer);

  handleSourceChange(index) {
    this.setState({source: index});
  }

  handlePresetChange(index) {
    const layerNames = ["Input", "Dropout", "SparseMul", "GraphSum", "ReLU", "Dropout", "MatMul", "GraphSum"];
    this.setState({
      preset: index,
      layers: layerNames.map(this.getLayer),
      nextLayerId: layerNames.length
    });
  }

  handleLayerAdd(layer) {
    const newLayer = this.copyLayer(layer, this.state.nextLayerId);
    this.resetLayerParams(newLayer);
    this.setState({
      preset: 0,
      layers: this.state.layers.concat(newLayer),
      nextLayerId: this.state.nextLayerId + 1
    });
  }

  handleLayerRemove(layer) {
    this.setState({
      preset: 0,
      layers: this.state.layers.filter(l => l.id !== layer.id)
    });
  }

  handleLayerChange(layerToChange, newData) {
    const newLayer = this.copyLayer(layerToChange);
    newLayer.data = newData;

    this.setState({
      layers: this.state.layers.map(layer => layer.id === layerToChange.id ? newLayer : layer)
    });
  }

  cast(value, type) {
    switch (type) {
      case "frac":
      case "dim":
        const num = parseFloat(value);
        return isNaN(num) ? value : num;
      case "bool":
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
      default:
        return value;
    }
  }

  castParams(layer) {
    const newLayer = this.copyLayer(layer);
    newLayer.params.forEach(param => {
      const value = newLayer.data[param.name];
      newLayer.data[param.name] = this.cast(value, param.type);
    });
    return newLayer;
  }

  handleSubmit() {
    const layers = this.state.layers.map(this.castParams);
    this.setState({layers: layers});
    const params = {
      dataset: this.availableSources[this.state.source],
      layers: layers.map(layer => layer.data).concat({name: "cross_entropy"})
    };
    const input = JSON.stringify(params);
    this.setState({text: "Running..."});

    const callback = (function () {
      if (xhr.readyState === 4) {
        this.setState({text: xhr.responseText});
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          this.setState({text:
            `Training accuracy: ${response.train_acc}
            Testing accuracy: ${response.test_acc}
            Time / Epoch: ${response.avg_train_time}`
          });
        }
        console.log(xhr);
      }
    }).bind(this);

    const xhr = new XMLHttpRequest(),
      url = "https://xtrap100.d2.comp.nus.edu.sg:4002/gcn";
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = callback;
    xhr.send(input);
    console.log(input);
  }

  render() {
    return (
      <div className="App">
        <Source
          source={this.state.source} onSourceChange={this.handleSourceChange} sources={this.availableSources}
          preset={this.state.preset} onPresetChange={this.handlePresetChange} presetLayers={this.availablePresetNames}
        />
        <LayerList layers={this.state.layers} onLayerClick={this.handleLayerRemove} suffix="2.png" hover="×" title="Current layers" onLayerChange={this.handleLayerChange} />
        <Submit onClick={this.handleSubmit} text={this.state.text} />
        <LayerList layers={this.availableLayers} onLayerClick={this.handleLayerAdd} suffix="1.jpg" hover="+" title="Available layers" />
      </div>
    );
  }
}

export default App;
