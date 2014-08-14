var fs = require('fs');

var DATABASE_PATH = './database/history.json';
var NUMBER_OF_MESSAGES_TO_SAVE = 25;

var read = function (callback) {
  fs.readFile(DATABASE_PATH, function (err, data) {
    data = data == null ? [] : JSON.parse(data);
    callback(data);
  });
};

var write = (function () {
  var toWrite = [];

  var writeToFile = function () {
    var dataToWrite = toWrite[0];
    read(function (data) {
      data.push(dataToWrite);
      data = data.slice(Math.max(data.length - NUMBER_OF_MESSAGES_TO_SAVE, 0));
      fs.writeFile(DATABASE_PATH, JSON.stringify(data), function (err) {
        toWrite.shift();
        if (toWrite.length > 0) {
          writeToFile()
        }
      });
    });
  };

  return function (data) {
    toWrite.push(data);
    writeToFile();
  };
})();

module.exports = {
  read: read,
  write: write
};