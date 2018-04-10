var path = require('path');
var fs = require('fs');
var request = require('request');



var jsreport = require('jsreport-core')(
  {
    "tasks": {
      "allowedModules": ["handlebars"],
      // "strategy": "http-server",
      "strategy": "in-process",
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
  var dataList = fs.readFileSync(path.join(__dirname, 'policyData.json')).toString();

  jsreport.init().then(async () => {

    await jsreport.documentStore.collection('templates').insert({
      content: "{{myHelper}}",
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf',
      helpers: helpers,
      chrome: {
        width: '10cm',
        height: '10cm'
      },

    })


    return await jsreport.render({
      template: {
        content: fs.readFileSync(path.join(__dirname, 'policyPrint.hbs')).toString(),
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        helpers: helpers,//"var handlerBars = require('handlebars');" +
        // 'function formatDate(_date) {let date = new Date(_date);return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()} ' +
        // 'function generateHtml(clause_text) {let htmlToDisplay = new handlerBars.SafeString(clause_text);return htmlToDisplay;}' +
        // "function mySum() {console.log('this) return this.$pdf.pages}", // helpers,
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }],

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