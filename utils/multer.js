const multer = require("multer");
const path = require("path");

// multer configuration
exports.pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/video/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//filter pdf
exports.pdfFilter = function (req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const validPdfExtensions = ['.pdf'];
  const validPdfMimeTypes = ['application/pdf'];

  if (validPdfExtensions.includes(extension) && validPdfMimeTypes.includes(mimetype)) {
    return cb(null, true);
  }
  
  cb("Invalid PDF format", false);
};
