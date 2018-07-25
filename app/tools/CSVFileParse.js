import fs from 'fs';
import parse from 'csv-parse';
// var transform = require('./transform-modules/model1-transform')

const loadCSVFile = (inputFile) => {
  return new Promise((resolve, reject) => {
    let csvData=[];
    fs.createReadStream(inputFile)
      .pipe(parse({delimiter: ','}))
      .on('data', function(csvrow) {
          csvData.push(csvrow);
      })
      .on('end',async function() {
        return resolve(csvData)
      });
  })
}

export default loadCSVFile
