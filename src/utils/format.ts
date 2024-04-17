export const pathToFileUrl = (filePath: string, apiUrl: string) => {
  let url: string = filePath.replace(/\\/g, "/");
  url = url.replace(/ /g, "%20");
  url = url.replace("public/", "");
  url = `${apiUrl}/${url}`;
  return url;
};

export const pathToFileFolder = (filePath: string) => {
  let folder: string = filePath.replace(/\\/g, "/");
  folder = folder.replace(/ /g, "%20");
  return folder;
};

export const formatSpacedFileName = (fileName: string): string => {
  return fileName.replace(/ /g, "_");
};