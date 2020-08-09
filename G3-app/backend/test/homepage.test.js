var supertest = require('supertest');
var app = require('../app');

// describe('HOMEPAGE', function () {
//     it('Testcase for GET \'/\'', function (done) {
//         supertest(app).get('/')
//             .expect('I have received your GET@index.js')
//             .expect(200, done);
//     })

//     it('Testcase for POST \'/\'', function (done) {
//         supertest(app).post('/')
//             .send({
//                 name: 'Sha Long',
//                 Birthday: '0310',
//                 cmd: 'ls'
//             })
//             .expect(200, done);
//     })
// })

describe('GCN_PAGE', function () {
    it('without JSON', function (done) {
        this.timeout(0);
        supertest(app).post('/gcn')
            .send({
                "dataset": "mexico"
            })
            .expect('Content-Type', /json/)
            .expect(200, done);
    })

    // it('Ee Ter JSON', function (done) {
    //     let data = require('./eeter.test.json');
    //     let ans = require('./eeter.ans.test.json');
    //     this.timeout(0);
    //     supertest(app).post('/gcn')
    //         .send(data)
    //         .expect('Content-Type', /json/)
    //         .expect(/avg_train_time/).expect(/data_slice.fw_loss average time/).expect(/epoch/)
    //         .expect(200, done);
    // })
})
