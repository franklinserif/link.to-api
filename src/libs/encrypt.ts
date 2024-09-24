import * as bcrypt from 'bcrypt';

export async function encryptPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  encryptedPassword: string,
) {
  return await bcrypt.compare(password, encryptedPassword);
}
