var express = require('express');
var router = express.Router();

const { res_to_json } = require('../gcn/gcn_list');
const { construct_gcn_run } = require('../gcn/gcn_list');
const { execSync } = require('child_process');
const fs = require('fs');

/* GET gcn page. */
router.get('/', function (req, res, next) {
    res.send('I have received your GET request.@gcn.js');
});

/* POST to gcn page */
router.post('/',function (req, res, next) {
    // write input json to front_end.json
    fs.writeFileSync('./gcn/front_end.json', JSON.stringify(req.body, null, 4))
    // construct gcn command to be run 
    var gcn_run = construct_gcn_run(req.body);
    console.log(gcn_run)
    var res_str, reply;
    try {
        // return the execution stdout as a string
        res_str = execSync(gcn_run).toString();
        // parse the result string to a json 
        reply = res_to_json(res_str);
    } catch (error) {
        reply = {"error" : "execution"}
    }
    res.json(reply);
});

module.exports = router;
