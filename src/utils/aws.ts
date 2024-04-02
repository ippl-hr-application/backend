import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "SouthJkt-a",
  endpoint: "https://is3.cloudhost.id",

  credentials: {
    accessKeyId: "QZ9A8A2GHN3FGZQQAAKW",
    secretAccessKey: "qEtlBEz4V8l7bA3icjpwVxBadvUBWDMUDB4uFnHT",
  },
});
