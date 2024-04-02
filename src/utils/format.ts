export const pathToFileUrl = (filePath: string, apiUrl: string) => {
  let url: string = filePath.replace(/\\/g, "/");
  url = url.replace(/ /g, "%20");
  url = url.replace("public/", "");
  url = `${apiUrl}/${url}`;
  return url;
};
