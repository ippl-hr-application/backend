import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "public/uploads/";
    if (file.fieldname === "permission_file") {
      dest = "public/uploads/permission_file/";
    }
    if (file.fieldname === "leave_file") {
      dest = "public/uploads/leave_file/";
    }
    if (file.fieldname === "mutation_file") {
      dest = "public/uploads/mutation_file/";
    }
    if (file.fieldname === "attendance_file") {
      dest = "public/uploads/attendance_file/";
    }
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
