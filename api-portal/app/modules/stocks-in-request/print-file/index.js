

var pdf = require("pdf-creator-node");
var fs = require("fs");
var html = fs.readFileSync("purchase.html", "utf8");

var options = {
    format: "A4",
    orientation: "portrait",
    // border: "10mm",
    header: {
        height: "0mm",
        // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            // first: 'Cover page',
            // 2: 'Second page', // Any page number is working. 1-based index
            // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            // last: 'Last Page'
        }
    }
};

var users = [
    {
        name: "Shyam",
        age: "26",
    },
    {
        name: "Navjot",
        age: "26",
    },
    {
        name: "Vitthal",
        age: "26",
    },
];
var document = {
    html: html,
    data: {
        users: users,
    },
    path: "./output.pdf",
    type: "",
};

pdf
    .create(document, options)
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });
