import multer from "multer";
import fs from "fs";
import { formatSpacedFileName } from "../utils/format";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "public/uploads/";
    if (file.fieldname === "permission_file") {
      dest = "public/uploads/permission_file/";
    }
    if (file.fieldname === "sick_file") {
      dest = "public/uploads/sick_file";
    }
    if (file.fieldname === "leave_file") {
      dest = "public/uploads/leave_file/";
    }
    if (file.fieldname === "mutation_file") {
      dest = "public/uploads/mutation_file/";
    }
    if (file.fieldname === "resign_file") {
      dest = "public/uploads/resign_file/";
    }

    if (file.fieldname === "attendance_file") {
      dest = "public/uploads/attendance_file/";
    }
    if (file.fieldname === "template_file") {
      dest = "public/uploads/template_file/";
    }
    if (file.fieldname === "document_file") {
      dest = "public/uploads/document_file/";
    }
    if (file.fieldname === "announcement_file") {
      dest = "public/uploads/announcement_file/";
    }
    if (file.fieldname === "attendance_submission_file") {
      dest = "public/uploads/attendance_submission_file/";
    }
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const splittedOriginalName = file.originalname.split(".");
    const extension = splittedOriginalName[splittedOriginalName.length - 1];
    const formattedFileName = formatSpacedFileName(splittedOriginalName[0]);
    cb(
      null,
      `${formattedFileName}-${new Date().getTime()}.${extension}`
    );
  },
});

export const upload = multer({ storage: storage });
