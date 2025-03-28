import React from 'react';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
  const user = {
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: '/avatar.jpg', // 可选
  };

  const handleLogout = () => {
    // 处理退出登录逻辑
    console.log('Logout');
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      {/* 其他内容 */}
    </div>
  );
};

export default App; 