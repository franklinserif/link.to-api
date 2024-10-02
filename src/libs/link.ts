import { v4 as uuid } from 'uuid';
import { BASE62CHARS } from '@shared/constants/base62';

function encodeBase62(id: number) {
  let enconded = '';

  while (id > 0) {
    const remainder = id % 62;
    enconded = BASE62CHARS[remainder] + enconded;
    id = Math.floor(id / 62);
  }

  return enconded;
}

function getHashCode(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return Math.abs(hash);
}

export function shortenURL() {
  const id = uuid();

  const hashCode = getHashCode(id);

  const shortURL = encodeBase62(hashCode);

  return shortURL;
}
