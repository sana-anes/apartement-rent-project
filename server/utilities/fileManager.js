const fs = require("fs");
const debug = require("debug")("app:routes");

const moveFile = (from, to) => {
  fs.rename(from, to, (err) => {
    if (err) debug(`image was not moved to it's directory`);
  });
};
const deleteFile = (filePath) => {
  fs.unlink(filePath, function (error) {
    debug(error);
  });
};


module.exports= {moveFile,deleteFile}
