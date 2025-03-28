-- 确保有这些必要的表结构

-- 收益记录表
CREATE TABLE earnings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'strategy' or 'referral'
    strategy_id VARCHAR(36),
    source_user_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at)
);

-- 策略表
CREATE TABLE strategies (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL, -- 'active' or 'inactive'
    mode VARCHAR(20) NOT NULL,   -- 'simulation' or 'live'
    parameters JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_run_time TIMESTAMP,
    INDEX idx_user (user_id)
);

-- 推广记录表
CREATE TABLE referrals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    inviter_id VARCHAR(36) NOT NULL,
    invitee_id VARCHAR(36) NOT NULL,
    level INT NOT NULL, -- 1 or 2
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inviter (inviter_id)
); 