export const generateString = (length: number): string => {
  const chrs = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    const pos = Math.floor(Math.random() * chrs.length);
    str += chrs.substring(pos, pos + 1);
  }
  return str;
};
