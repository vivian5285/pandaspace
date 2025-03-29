import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// 通用限流配置
export const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate-limit:general:',
  }),
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100次请求
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

// 交易相关限流配置
export const tradingLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate-limit:trading:',
  }),
  windowMs: 60 * 1000, // 1分钟
  max: 30, // 限制30次请求
  message: '交易请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

// 登录限流配置
export const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate-limit:login:',
  }),
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5, // 限制5次尝试
  message: '登录尝试次数过多，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

// IP 黑名单检查
export const ipBlacklist = async (req: any, res: any, next: any) => {
  const ip = req.ip;
  const isBlacklisted = await redis.sismember('ip-blacklist', ip);

  if (isBlacklisted) {
    return res.status(403).json({
      error: '您的IP已被封禁，请联系管理员',
    });
  }

  next();
}; 