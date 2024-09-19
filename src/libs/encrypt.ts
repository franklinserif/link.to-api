import * as bcrypt from 'bcrypt';

export async function encryptPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(
  encryptedPassword: string,
  password: string,
) {
  return await bcrypt.compare(encryptedPassword, password);
}
