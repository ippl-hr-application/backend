import fs from "fs";

export const deleteFile = async (filePath: string) => {
  const path = "public/uploads" + filePath.split("uploads")[1];
  const absolutePath = decodeURIComponent(path);

  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist:", err);
      return;
    }

    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
      console.log("File deleted successfully");
    });
  });
};
