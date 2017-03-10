"use strict";

// user test : ab6f35b0-fcd3-11e6-a5cc-0d202563c14f

//Globals variables
const csvToArray = require('./lib/csvToarray.min');
const fs = require('fs');
const config = require('./config/config');

var csv;
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

//Create candidate "Database"
csv = fs.readFileSync(config._IMPORT_PATH.timeline, 'utf8');
var data = csvToArray.CSVTOARRAY(csv);
var timeline = []
console.log(timeline);


for (var i = 1; i < data.length; i++) {
    if (data[i][0].length > 0) {
        var item = {
            id: i,
            title: cleanText(data[i][0]),
            category: {
                index: getIndexCategory(cleanText(data[i][1])),
                name: cleanText(data[i][1]),
                // todo: parse color from category
                color: '#0000ff'
            },
            hashtag: data[i][2].length > 0 ? data[i][2].split(" ") : null,
            description: cleanText(data[i][3]),
            date: parseDate(data[i][4]),
            url: data[i][5],
            medias: {
                image: data[i][6].length > 0 ? data[i][6] : null,
                video: data[i][7].length > 0 ? data[i][7] : null
            }
        };
        timeline.push(item);
    }
}
function getIndexCategory(cat) {
    var id = 0;
    console.log(cat);
    switch (cat) {
        case 'Connected Sports Gear':
            return 0;
            break;
        case 'VR':
            return 3;
            break;
        case 'Interactive Experiences':
            return 4;
            break;
        case 'E-Sport':
            return 2;
            break;
        case 'App':
            return 1;
            break;
        default:
            return 0;
            break;

    }
}

function parseDate(date) {
    var dmy = date.split('/');
    var y = parseInt(dmy[2]),
        m = parseInt(dmy[1]),
        d = parseInt(dmy[0]);
    return {
        time: new Date(y, m, d),
        utc: Date.UTC(y, m, d),
        year: y,
        month: {
            value: m,
            name: monthNames[m - 1]
        },
        day: d
    };
}

function cleanText(txt) {
    return txt.trim().replace(/\s(:|;|%|€|\$|°C|°F|»|\!|\?|–)/, '&nbsp;$1');
}

var data_exports = [];
timeline = timeline.sort(function (a, b) {
    return a.date.time.getTime() < b.date.time.getTime() ? -1 : a.date.time.getTime() > b.date.time.getTime() ? 1 : 0
})
// console.log(timeline);
var month_old = false, month;
var tmp_month = [];
var timeline_by_month = [];

for (var i = 0; i < timeline.length; i++) {
    month = timeline[i].date.month.value;
    if (!month_old) {
        month_old = month;
    }

    if (month === month_old) {
        tmp_month.push(timeline[i])
    } else {
        timeline_by_month.push(tmp_month);
        tmp_month = [];
    }

    month_old = month;
}
timeline_by_month.push(tmp_month);

// console.log(timeline);

//Write Database on disk
var data_to_write = 'TIMELINE = ' + JSON.stringify(timeline_by_month) + ';';

fs.writeFile(config._EXPORT_PATH_DATA, data_to_write, (err) => {
    if (err) throw err;
console.log('Data saved!');
})
;
