import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // 处理注册逻辑
      console.log('Register data:', data);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* 用户名输入框 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          用户名
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            {...register('username', {
              required: '请输入用户名',
              minLength: {
                value: 3,
                message: '用户名长度至少为 3 位',
              },
            })}
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.username ? 'border-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>
        {errors.username && (
          <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      {/* 邮箱输入框 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          邮箱地址
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            {...register('email', {
              required: '请输入邮箱地址',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '请输入有效的邮箱地址',
              },
            })}
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* 密码输入框 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          密码
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            {...register('password', {
              required: '请输入密码',
              minLength: {
                value: 6,
                message: '密码长度至少为 6 位',
              },
            })}
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* 确认密码输入框 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          确认密码
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            {...register('confirmPassword', {
              required: '请确认密码',
              validate: value =>
                value === password || '两次输入的密码不一致',
            })}
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* 注册按钮 */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? '注册中...' : '注册'}
        </button>
      </div>
    </form>
  );
}; 