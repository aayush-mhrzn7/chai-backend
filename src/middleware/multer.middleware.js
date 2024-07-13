import multer from "multer";
//this is middleware using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log(file);
  },
});

export const upload = multer({ storage: storage });
