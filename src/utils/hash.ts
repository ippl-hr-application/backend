import bcrypt from "bcrypt";

const genSalt = bcrypt.genSaltSync(10);

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, genSalt);
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
