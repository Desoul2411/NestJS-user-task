const crypto = require('crypto');

export const encrypt = (password: string, ENC_KEY: string): string => {
  const IV = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
  let encrypted = cipher.update(password, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const ivBase64 = IV.toString('base64');
  return Buffer.from(`${encrypted}--${ivBase64}`).toString('base64');
};

export const decrypt = (encryptedPassword: string, ENC_KEY: string): string => {
  const utf8Pass = Buffer.from(encryptedPassword, 'base64').toString('utf-8');
  const [password, IV] = utf8Pass.split('--');
  const bufferedIV = Buffer.from(IV, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, bufferedIV);
  const decrypted = decipher.update(password, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};

export const hashToSha256 = (userName:string, HASH_SECRET: string):string => {
  return crypto
  .createHmac('sha256', HASH_SECRET)
  .update(userName)
  .digest('hex');
};
