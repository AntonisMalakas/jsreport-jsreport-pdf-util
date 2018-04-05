var express = require('express');
const numCPUs = require('os').cpus().length;

var router = express.Router();

// Import the required controllers
// to use them according the call.
var policyPrintController = require('./../controllers/underwriting/policyPrint/policyPrint.controller');


router.get('/', function (req, res, next) {
    res.write('this pc has ' + numCPUs +' cores \n' );
    res.write('use /production  to test a simple jsreport pdf generator \n')
    res.write('use /policy      to generate policies + html \n')
    res.write('use /group       to test the groupping policies ')

    res.end()

});


router.get('/policy', policyPrintController.policyPrint);



module.exports = router;
