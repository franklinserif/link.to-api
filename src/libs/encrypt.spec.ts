import { comparePassword, encryptPassword } from './encrypt';

const password = 'f12345678';

describe('encrypt', () => {
  it('should return a password different to original password', async () => {
    const encryptedPassword = await encryptPassword('f123456789');
    expect(encryptedPassword).not.toEqual(encryptPassword);
  });

  it('should be the same password', async () => {
    const encryptedPassword = await encryptPassword(password);
    const isSame = await comparePassword(password, encryptedPassword);
    expect(isSame).toBeTruthy();
  });
});
