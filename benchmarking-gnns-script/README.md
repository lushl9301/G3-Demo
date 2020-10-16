# Dataset importing script
The python script `extract.py` in this directory was made to extract datasets from the graphdeeplearning/benchmarking-gnns repository.

## Usage
The script was intended to be placed in the root directory of the above-mentioned repository. If it is in another directory, the import statement should be updated accordingly. Follow the benchmark installation instructions from the above-mentioned repository before running the script.

It is intended to be run in a Python shell as follows:

```python-repl
>>> import extract as e
>>> DotDict = e.d
>>> c = e.c()
[I] Loading dataset SBM_CLUSTER...
train, test, val sizes : 10000 1000 1000
[I] Finished loading.
[I] Data load time: 17.2808s
>>> c.write_graph("cluster.graph")
[(DGLGraph(num_nodes=1172320, num_edges=43038630,
         ndata_schemes={'feat': Scheme(shape=(), dtype=torch.int64)}
         edata_schemes={'feat': Scheme(shape=(1,), dtype=torch.float32)}), tensor([0, 3, 3,  ..., 3, 0, 0])), (DGLGraph(num_nodes=117833, num_edges=4343918,
         ndata_schemes={'feat': Scheme(shape=(), dtype=torch.int64)}
         edata_schemes={'feat': Scheme(shape=(1,), dtype=torch.float32)}), tensor([1, 0, 0,  ..., 2, 1, 4])), (DGLGraph(num_nodes=116283, num_edges=4238132,
         ndata_schemes={'feat': Scheme(shape=(), dtype=torch.int64)}
         edata_schemes={'feat': Scheme(shape=(1,), dtype=torch.float32)}), tensor([2, 5, 4,  ..., 5, 5, 3]))]
(DGLGraph(num_nodes=1406436, num_edges=51620680,
         ndata_schemes={'feat': Scheme(shape=(), dtype=torch.int64)}
         edata_schemes={'feat': Scheme(shape=(1,), dtype=torch.float32)}), tensor([0, 3, 3,  ..., 5, 5, 3]))
>>> c.write_feature("cluster.svmlight", c.embed())
>>> c.write_split("cluster.split")
>>>
```

## Methods

### extract.c(), extract.p()
The code below to be run in the Python shell returns a `Dataset` object defined in this script for the CLUSTER or PATTERN dataset. 
```py
import extract as e
DotDict = e.d
c = e.c()
```
After running the above commands, `c` contains a `Dataset` object.

### Dataset.batch()
Takes all the individual small graphs in the dataset, batches them into three big graphs, and returns them. Also stores them into the `Dataset` object. Will be run by the following methods if necessary, and may take up to a minute.

### Dataset.collate\_all()
Takes the three big graphs obtained earlier, collates them into one big graph, and returns them. Also stores them into the `Dataset` object. Will be run by the following methods if necessary, and may take up to a minute.

### Dataset.write\_graph(file\_name)
Writes the graph out to a file. Each line corresponds to a node, and each zero-based index in the line corresponds to the node it is connected to. Possibly the longest operation, may take a few minutes.

### Dataset.write\_feature(file\_name, feat\_format)
Writes the node features out to a file in svmlight format. `feat_format` specifies the conversion from node classification to feature. The methods available for `feat_format` are listed below. Example usage: `c.write_feature("cluster.svmlight", c.embed())`

#### Dataset.one\_hot()
Converts the output to one-hot format, e.g. `2 0:1`.
#### Dataset.embed(dim=16)
Converts the output to an embedding provided by `torch.nn.Embedding`, e.g.:
```
2 0:-0.5015365481376648 1:-0.08209487795829773 2:-1.6993145942687988 3:0.5299740433692932 4:-0.20700746774673462 5:-0.12163855880498886 6:-0.6162278056144714 7:-1.3302956819534302 8:-0.932964563369751 9:-0.6555889844894409 10:-1.3024801015853882 11:0.14688433706760406 12:-1.9308525323867798 13:-1.1833853721618652 14:-0.908301591873169 15:-0.4501953423023224
```

### Dataset.write\_graph(file\_name)
Writes the graph split out to a file. Each line corresponds to a node, and it contains the node's position in the batched graphs list.
