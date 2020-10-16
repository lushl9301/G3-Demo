import torch
from data.data import LoadData
# Requires graphdeeplearning/benchmarking-gnns repository
# Follow benchmark installation instructions from the above repository
# Place script in root of repository or update above import accordingly
# Example usage:
# >>> import extract as e
# >>> DotDict = e.d
# >>> c = e.c()
# [I] Loading dataset SBM_CLUSTER...
# train, test, val sizes : 10000 1000 1000
# [I] Finished loading.
# [I] Data load time: 17.2808s
# >>> c.write_graph("cluster.graph")
# (graph processing debug output here)
# >>> c.write_feature("cluster.svmlight", c.embed())
# >>> c.write_split("cluster.split")
# >>>

# This class is required as DotDict by pickle loading in SBMsDataset initialisation
# It can be found in main_SBMs_node_classification.py
class d(dict):
    def __init__(self, **kwds):
        self.update(kwds)
        self.__dict__ = self

def p():
    return Dataset(LoadData('SBM_PATTERN'))

def c():
    return Dataset(LoadData('SBM_CLUSTER'))

# Wrapper class storing the loaded dataset, batched graphs, and collated graph
class Dataset:
    graphs = None
    collated = None

    def __init__(self, dataset):
        self.dataset = dataset
        # Taken from main_SBMs_node_classification.py
        self.in_dim = torch.unique(dataset.train[0][0].ndata['feat'],dim=0).size(0) # node_dim (feat is an integer)
        self.n_classes = torch.unique(dataset.train[0][1],dim=0).size(0)

    # Batches entire training dataset into one graph, then does the same for the other two
    def batch(self):
        if self.graphs is None:
            dataset = self.dataset
            self.graphs = [dataset.collate(g) for g in [dataset.train, dataset.val, dataset.test]]
            print(self.graphs)
        return self.graphs

    # Collates the list of batched graphs into a single graph
    def collate_all(self):
        if self.collated is None:
            self.graphs = self.batch()
            self.collated = self.dataset.collate(self.graphs)
            print(self.collated)
        return self.collated

    # Writes the graph out to a file
    # Each line corresponds to a node
    # Each zero-based index in a line corresponds to the node it is connected to
    def write_graph(self, file_name):
        g, _ = self.collate_all()
        with open(file_name, 'w') as f:
            for n in g.nodes():
                f.write(' '.join(str(e.item()) for e in g.out_edges(n)[1]) + '\n')

    # Writes the node features out to a file in svmlight format
    # feat_format specifies the conversion from node classification to feature
    def write_feature(self, file_name, feat_format):
        g, l = self.collate_all()
        zipped = torch.transpose(torch.stack((l, g.ndata['feat'])), 0, 1)
        with open(file_name, 'w') as f:
            for label, feat in zipped:
                f.write(str(label.item()) + ' ' + feat_format(feat.item()) + '\n')

    # Converts node classification to feature
    def one_hot(_): return lambda feat: str(feat) + ':1'
    def embed(self, dim=16):
        embedding = torch.nn.Embedding(self.in_dim, dim)
        def get_str(feat):
            e = embedding(torch.tensor(feat))
            return ' '.join(str(num) + ':' + str(val.item()) for num, val in enumerate(e))
        return get_str

    # Writes the graph split out to a file
    # Each line corresponds to a node
    # Each line contains the node's position in the batched graphs list
    def write_split(self, file_name):
        graphs = self.batch()
        with open(file_name, 'w') as f:
            for num, g in enumerate(graphs, start=1):
                f.write((str(num) + '\n') * len(g[0]))
