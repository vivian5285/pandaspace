import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

interface UserSettingsForm {
  nickname: string;
  email: string;
  googleAuthCode: string;
  binanceApiKey: string;
  binanceSecretKey: string;
  okxApiKey: string;
  okxSecretKey: string;
  okxPassphrase: string;
}

export const UserSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserSettingsForm>();

  const onSubmit = async (data: UserSettingsForm) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form data:', data);
      // 处理成功提示
    } catch (error) {
      // 处理错误提示
      console.error('Error:', error);
    }
  };

  const sections = [
    { id: 'profile', name: '基本信息', icon: UserCircleIcon },
    { id: '2fa', name: '安全设置', icon: ShieldCheckIcon },
    { id: 'api', name: 'API 设置', icon: KeyIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">账户设置</h1>

        {/* 设置导航 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <nav className="flex divide-x divide-gray-200">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 px-4 py-4 flex items-center justify-center space-x-2
                          ${
                            activeSection === section.id
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                          }`}
              >
                <section.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{section.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 表单区域 */}
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            {/* 基本信息 */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    昵称
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('nickname', {
                        required: '请输入昵称',
                        minLength: {
                          value: 2,
                          message: '昵称至少2个字符',
                        },
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm
                               focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.nickname && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nickname.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    邮箱
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      {...register('email', {
                        required: '请输入邮箱',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: '请输入有效的邮箱地址',
                        },
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm
                               focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 安全设置 */}
            {activeSection === '2fa' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    谷歌验证器
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('googleAuthCode', {
                        required: '请输入验证码',
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: '验证码为6位数字',
                        },
                      })}
                      placeholder="输入6位验证码"
                      className="block w-full rounded-md border-gray-300 shadow-sm
                               focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.googleAuthCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.googleAuthCode.message}
                      </p>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    请使用谷歌验证器扫描二维码，输入验证码进行绑定
                  </p>
                </div>
              </div>
            )}

            {/* API设置 */}
            {activeSection === 'api' && (
              <div className="space-y-8">
                {/* Binance API */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Binance API</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        {...register('binanceApiKey')}
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Secret Key
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        {...register('binanceSecretKey')}
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* OKX API */}
                <div className="space-y-6 pt-6 border-t">
                  <h3 className="text-lg font-medium text-gray-900">OKX API</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        {...register('okxApiKey')}
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Secret Key
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        {...register('okxSecretKey')}
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Passphrase
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        {...register('okxPassphrase')}
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 保存按钮 */}
            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent
                         rounded-md shadow-sm text-sm font-medium text-white bg-blue-600
                         hover:bg-blue-700 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? '保存中...' : '保存设置'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 