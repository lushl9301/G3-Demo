module.exports = {
    // construct_gcn_run: (dataset) => {
    //     return `./gcn/gcn --feature_file=./gcn/dataset/gcn/${dataset}.svmlight --graph_file=./gcn/dataset/gcn/${dataset}.graph --split_file=./gcn/dataset/gcn/${dataset}.split`;
    // },
    construct_gcn_run: (body) => {
        var command = './gcn/gcn'

        for (var key of Object.keys(body)) {
            // for each key in input json
            // add optional arguments according to its key
            switch (key) {
                case 'dataset':
                    command += ` --feature_file=./gcn/dataset/gcn/${body.dataset}.svmlight --graph_file=./gcn/dataset/gcn/${body.dataset}.graph --split_file=./gcn/dataset/gcn/${body.dataset}.split`
                    break;
                case 'layers':
                    command += ' --json_file=./gcn/front_end.json'
                    break;
                default:
                    argv = ''
                    break;
            }
        }

        return command;
    },

    res_to_json: (res_str) => {
        var reply = {}; // init a empty json
        // choose the text of last iteration and anything after it
        res_str = res_str.slice(res_str.lastIndexOf('epoch')).trim();
        // split the res_str by '\n' and ','
        var res_list = res_str.split(/\s*[\n,]\s*/);
        // for each result item, split by ':' and '=', and form a json using the items
        res_list.forEach((value, index, array) => {
            var curr = value.split(/\s*[:=]\s*/);
            reply[curr[0]] = curr[1];
        })
        return reply;
    }
}
