'use strict';

const multer = require(`multer`);
const path = require(`path`);
const mime = require(`mime`);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, `../public/img`));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.thumbnail.${mime.getExtension(file.mimetype)}`);
  }
});
const upload = multer({storage});

module.exports = upload;
