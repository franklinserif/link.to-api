import { encryptPassword, comparePassword } from './encrypt';

const password = 'jT12345678*';

describe('encryptPassword', () => {
  it('should return a different value that the original password', async () => {
    const securePassword = await encryptPassword(password);
    expect(securePassword).not.toEqual(password);
  });
});

describe('comparePassword', () => {
  it('should return true', async () => {
    const securePassword = await encryptPassword(password);
    const result = await comparePassword(password, securePassword);

    expect(securePassword).toBeTruthy();
  });
});
