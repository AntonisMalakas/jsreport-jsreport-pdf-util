var path = require('path');
var fs = require('fs');
var request = require('request');



var jsreport = require('jsreport-core')(
  {
    "tasks": {
      "allowedModules": "*",
      "strategy": "http-server",
      // "strategy": "in-process",
      "numberOfWorkers": 8
    },
    "scripts": { "allowedModules": "*" },
    "phantom": {
      "strategy": "phantom-server",
      "numberOfWorkers": 8
    },
  }
);
jsreport.use(require('jsreport-handlebars')());
jsreport.use(require('jsreport-chrome-pdf')());
jsreport.use(require('jsreport-phantom-pdf')());
jsreport.use(require('jsreport-pdf-utils')());
jsreport.use(require('jsreport-templates')());

var helpers = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'helpers/helpers.js'), 'utf8');

exports.policyPrint = async (req, res, next) => {

  // Used to get data from localJson, and it worked fine for a small amout of data
  // But when the data is being called from and api, with huge amout of data, 
  // it is resulting with the  Error: Navigation Timeout Exceeded: 30000ms exceeded

  //var dataList = fs.readFileSync(path.join(__dirname, 'policyData.json')).toString();

  let url = "http://pixel-web:8017/api/Policy/GetPolicyForPrint";
  request(url, { json: true }, (error, response, body) => {
    if (error) { return console.log(error); }
    var policyPrintList = body;
    let json = policyPrintList;

    let policies_data = [];

    for (let i = 0; i < json[0].length; i++) {
      policies_data.push({
        LOB_DESC: json[0][i].LOB_DESC,
        PRODUCT_DESC: json[0][i].PRODUCT_DESC,
        POLICY_NO: json[0][i].POLICY_NO,
        END_NO: json[0][i].END_NO,
        SUM_INSURED: json[0][i].SUM_INSURED,
        SUM_INSURED_CUR_CODE: json[0][i].SUM_INSURED_CUR_CODE,
        SUM_INSURED_CUR_DESC: json[0][i].SUM_INSURED_CUR_DESC,
        DATE_EFFECTIVE: json[0][i].DATE_EFFECTIVE,
        DATE_EXPIRY: json[0][i].DATE_EXPIRY,
        TOTAL_PREMIUM: json[0][i].TOTAL_PREMIUM,
        PREMIUM_CUR_CODE: json[0][i].PREMIUM_CUR_CODE,
        PREMIUM_CUR_DESC: json[0][i].PREMIUM_CUR_DESC,
        POLICY_END_AT_NOON: json[0][i].POLICY_END_AT_NOON,
        PRINT_NAME: json[0][i].PRINT_NAME,
        TITLE_DESC: json[0][i].TITLE_DESC,
        PRINT_ADDRESS: json[0][i].PRINT_ADDRESS,
        Covers: json[1].filter(x => x.POLICY_ID == json[0][i].ID),
        Clauses: json[2].filter(x => x.POLICY_ID == json[0][i].ID)
      });
    }

    // per request of bjrmatos
    let obj = new Object({
      data: policies_data
    });

    jsreport.init().then( () => {

       jsreport.documentStore.collection('templates').insert({
        content: "{{myHelper}}",
        shortid: 'header',
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        helpers: helpers,
        chrome: {
          width: '15cm',
          height: '1cm'
        },

      });

      return  jsreport.render({
        template: {
          content: fs.readFileSync(path.join(__dirname, 'policyPrint.hbs')).toString(),
          engine: 'handlebars',
          recipe: 'chrome-pdf',
          helpers: helpers,
          pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }],

        },

        data: obj
      }).then(function (resp) {
        res.contentType('application/pdf');
        res.send(resp.content);
      });
    }).catch(function (e) {
      console.log(e)
    })
  });

}