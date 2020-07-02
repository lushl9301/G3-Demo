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
    this.state = {source: 0, layers: [], nextLayerId: 0};
  }

  copyData(data) {
    return {layerNum: data.layerNum, name: data.name, params: {...data.params}};
  }

  availableSources = ["citeseer", "cora", "pubmed"];
  availablePresetNames = ["No preset layers", "Preset"];
  possibleLayers = [
    {layerNum: 0, name: "Dropout", params: {rate: "0.5"}},
    {layerNum: 1, name: "SparseMul", params: {height: "in_dim", width: "16", decay: "true"}},
    {layerNum: 2, name: "GraphSum"},
    {layerNum: 3, name: "ReLU"},
    {layerNum: 4, name: "MatMul", params: {height: "16", width: "out_dim", decay: "false"}},
    {layerNum: 6, name: "SoftMax"},
    {layerNum: 7, name: "MaxPool"},
  ];
  availableLayers = this.possibleLayers.map((data, index) => (
    {id: index, data: this.copyData(data)}
  ));

  handleSourceChange(index) {
    this.setState({source: index});
  }

  handlePresetChange(index) {
    let layerData = [{layerNum: 8, name: "Input"}];
    let layerNames = ["Dropout", "SparseMul", "GraphSum", "ReLU", "Dropout", "MatMul", "GraphSum"];
    layerData.push(...layerNames.map(name => {
      let data = {layerNum: 5, name: "Output"};
      this.availableLayers.forEach(layer => {
        if (layer.data.name === name) {
          data = this.copyData(layer.data);
        }
      });
      return data;
    }));
    this.setState({
      preset: index,
      layers: layerData.map((data, index) => ({id: index, data: this.copyData(data)}))
    });
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
    this.setState({text: "Running..."});

    const callback = (function () {
      if (xhr.readyState === 4) {
        this.setState({text: xhr.responseText});
        if (xhr.status === 200) {
          let response = JSON.parse(xhr.responseText);
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
