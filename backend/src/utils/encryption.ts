import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export class Encryption {
  private static readonly secretKey = process.env.ENCRYPTION_KEY || 'your-secret-key';

  // 加密数据
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = crypto.pbkdf2Sync(this.secretKey, salt, 100000, KEY_LENGTH, 'sha256');
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')]).toString('base64');
  }

  // 解密数据
  static decrypt(encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const salt = buffer.slice(0, SALT_LENGTH);
    const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = buffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const key = crypto.pbkdf2Sync(this.secretKey, salt, 100000, KEY_LENGTH, 'sha256');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  }

  // 生成安全的随机字符串
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // 计算哈希值
  static hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // 验证哈希值
  static verifyHash(data: string, hash: string): boolean {
    return this.hash(data) === hash;
  }
} 