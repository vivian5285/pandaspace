import winston from 'winston';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // 错误日志写入文件
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // 所有日志写入文件
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
    // 开发环境下控制台输出
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
          }),
        ]
      : []),
  ],
});

// 添加请求追踪
export const addRequestContext = (requestId: string) => {
  return winston.createLogger({
    defaultMeta: { requestId },
    ...logger.options,
  });
}; 