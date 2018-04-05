var handlerBars = require('handlebars');

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

function mySum() {
    console.log('this.$pdf.pages ', this.$pdf.pages)
    return this.$pdf.pages[this.$pdf.pageIndex].items;
  }