"use strict";

// user test : ab6f35b0-fcd3-11e6-a5cc-0d202563c14f

//Globals variables
const csvToArray  = require('./lib/csvToarray.min');
const fs          = require('fs');
const config      = require('./config/config');

var csv;

//Create candidate "Database"
csv = fs.readFileSync(config._IMPORT_PATH.timeline,'utf8');
var data = csvToArray.CSVTOARRAY(csv);
var timeline = []
console.log(timeline);


for(var i = 1; i < data.length; i++) {
    if(data[i][0].length > 0) {
        var item = {
            id: i,
            title: cleanText(data[i][0]),
            category: {
                name: cleanText(data[i][1]),
                // todo: parse color from category
                color: '#0000ff'
            },
            hashtag: data[i][2].length > 0 ? data[i][2].split(" "): null,
            description: cleanText(data[i][3]),
            date: parseDate(data[i][4]),
            url: data[i][5],
            medias: {
                image: data[i][6].length > 0 ? data[i][6]: null,
                video: data[i][7].length > 0 ? data[i][7]: null
            }
        };
        timeline.push(item);
        console.log(item);
    }
}

function parseDate(date) {
    var dmy = date.split('/');
    var y = parseInt(dmy[2]),
        m = parseInt(dmy[1]),
        d = parseInt(dmy[0]);
    return {
        year: y,
        month: m,
        day: d
    };
}

function cleanText(txt) {
    return txt.trim().replace(/\s(:|;|%|€|\$|°C|°F|»|\!|\?|–)/, '&nbsp;$1');
}

//Write Database on disk
var data_to_write = 'TIMELINE      = '+ JSON.stringify(timeline)+';';

fs.writeFile(config._EXPORT_PATH_DATA, data_to_write, (err) => {
    if (err) throw err;
    console.log('Data saved!');
});
