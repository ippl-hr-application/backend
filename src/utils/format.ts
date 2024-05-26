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

export const numberToMonthName = (month: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
};