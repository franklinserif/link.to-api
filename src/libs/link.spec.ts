import { shortenURL } from './link';

describe('shortenUrl', () => {
  it('should return a short id ', () => {
    const shortId = shortenURL();

    expect(shortId).not.toBeNull();
    expect(shortId).not.toBeNaN();
    expect(shortId).not.toBeUndefined();
  });
});
