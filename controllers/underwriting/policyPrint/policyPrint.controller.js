var path = require('path');
var fs = require('fs');
var request = require('request');


var jsreport = require('jsreport-core')(
  {
    "tasks": {
      "allowedModules": ["handlebars"],
      "strategy": "http-server",
      "numberOfWorkers": 8
    },
    "phantom": {
      "strategy": "phantom-server",
      "numberOfWorkers": 8
    },
  }
);
jsreport.use(require('jsreport-handlebars')());
jsreport.use(require('jsreport-phantom-pdf')());
jsreport.use(require('jsreport-pdf-utils')());

var helpers = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'helpers/helpers.js'), 'utf8');

exports.policyPrint = function (req, res, next) {
  var dataList = fs.readFileSync(path.join(__dirname, 'policyData.json')).toString();

  jsreport.init().then(function () {
    return jsreport.render({
      template: {
        engine: 'handlebars',
        content: fs.readFileSync(path.join(__dirname, 'policyPrint.hbs')).toString(),

        recipe: 'phantom-pdf',
        helpers: helpers, //"var handlerBars = require('handlebars');" +
        //'function formatDate(_date) {let date = new Date(_date);return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()} ' + 
        //'function generateHtml(clause_text) {let htmlToDisplay = new handlerBars.SafeString(clause_text);return htmlToDisplay;}' +
        //'function mySum() {return this.$pdf.pages}'   , // helpers,
        pdfOperations: [{ type: 'merge', renderForEveryPage: true }],
        phantom: {
          header: "{{mySum}}"
        },
      },

      data: dataList
    }).then(function (resp) {
      res.contentType('application/pdf');
      res.send(resp.content);
    });
  }).catch(function (e) {
    console.log(e)
  })


}