var handlerBars = require('handlebars');
const counter = require('./../controllers/underwriting/policyPrint/counter');

let groupPageCounter = 0;

function now() {
    return new Date().toLocaleDateString()
}

function nowPlus20Days() {
    var date = new Date()
    date.setDate(date.getDate() + 20);
    return date.toLocaleDateString();
}

function formatDate(_date) {
    let date = new Date(_date);
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
}

function total(items) {
    var sum = 0;
    items.forEach(function (i) {
        sum += i.price;
    });
    return sum;
}

function generateHtml(clause_text) {
    let htmlToDisplay = new handlerBars.SafeString(clause_text);
    return htmlToDisplay;
}


function myHelper() {
    let previousPageIndex = this.$pdf.pageIndex - 1;

    if (previousPageIndex == -1) {
        if (this.$pdf.pageIndex == 0) {
            this.groupPageCounter = 1;
            counter.setValue(1);
            return counter.get();
            //return this.groupPageCounter;

        }
    } else if (previousPageIndex > -1) {

        if (this.$pdf.pages[this.$pdf.pageIndex].group == this.$pdf.pages[previousPageIndex].group) {
            this.groupPageCounter = this.groupPageCounter + 1;
            // return this.groupPageCounter;
            counter.increment();
            return counter.get();
        }
        else {
            this.groupPageCounter = 1;
            counter.setValue(1);
            return counter.get();
            // return this.groupPageCounter;
        }
    }
}