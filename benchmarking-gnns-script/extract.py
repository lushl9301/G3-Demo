import torch
import data.SBMs as s

class d(dict):
    def __init__(self, **kwds):
        self.update(kwds)
        self.__dict__ = self

def p():
    return Dataset(s.SBMsDataset('SBM_PATTERN'))

def c():
    return Dataset(s.SBMsDataset('SBM_CLUSTER'))

class Dataset:
    graphs = None
    collated = None
    embedding = None

    def __init__(self, dataset):
        self.dataset = dataset
        # from main_SBMs_node_classification.py
        self.in_dim = torch.unique(dataset.train[0][0].ndata['feat'],dim=0).size(0) # node_dim (feat is an integer)
        self.n_classes = torch.unique(dataset.train[0][1],dim=0).size(0)

    def batch(self):
        if self.graphs is None:
            dataset = self.dataset
            self.graphs = [dataset.collate(g) for g in [dataset.train, dataset.val, dataset.test]]
            print(self.graphs)
        return self.graphs

    def collate_all(self):
        if self.collated is None:
            self.graphs = self.batch()
            self.collated = self.dataset.collate(self.graphs)
            print(self.collated)
        return self.collated

    def write_graph(self, file_name):
        g, _ = self.collate_all()
        with open(file_name, 'w') as f:
            for n in g.nodes():
                f.write(' '.join(str(e.item()) for e in g.out_edges(n)[1]) + '\n')

    def write_feature(self, file_name, feat_format = lambda feat: return str(feat) + ':1'):
        g, l = self.collate_all()
        zipped = torch.transpose(torch.stack((l, g.ndata['feat'])), 0, 1)
        with open(file_name, 'w') as f:
            for label, feat in zipped:
                f.write(str(label.item()) + ' ' + feat_format(feat.item()) + '\n')

    def write_feature_embed(self, file_name):
        g, l = self.collate_all()
        self.embedding = torch.nn.Embedding(self.in_dim, dim)
        embed = g.ndata['feat']
        zipped = torch.transpose(torch.stack((l, )), 0, 1)
        with open(file_name, 'w') as f:
            for label, feat in zipped:
                f.write(str(label.item()) + ' ' + feat_format(feat.item()) + '\n')

    def write_split(self, file_name):
        graphs = self.batch()
        with open(file_name, 'w') as f:
            for num, g in enumerate(graphs, start=1):
                f.write((str(num) + '\n') * len(g[0]))
