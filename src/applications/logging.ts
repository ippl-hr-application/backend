import winston from "winston";

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: "combined.log",
      format: winston.format.prettyPrint(),
    }),
  ],
});

// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.prettyPrint(),
//     })
//   );
// }
