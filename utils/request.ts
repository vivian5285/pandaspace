import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { notification } from 'antd'; // 假设使用 antd 作为 UI 库

// 响应数据的基础接口
interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建请求实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 添加 token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加时间戳防止缓存
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const { code, data, message } = response.data;

    // 处理业务错误
    if (code !== 0) {
      notification.error({
        message: '请求失败',
        description: message || '未知错误',
      });
      return Promise.reject(new Error(message || '未知错误'));
    }

    return data;
  },
  (error: AxiosError) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，跳转到登录页
          notification.error({
            message: '未授权',
            description: '请重新登录',
          });
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
          
        case 403:
          notification.error({
            message: '禁止访问',
            description: '您没有权限访问该资源',
          });
          break;
          
        case 404:
          notification.error({
            message: '请求失败',
            description: '请求的资源不存在',
          });
          break;
          
        case 500:
          notification.error({
            message: '服务器错误',
            description: '服务器发生错误，请稍后重试',
          });
          break;
          
        default:
          notification.error({
            message: '请求失败',
            description: error.message || '未知错误',
          });
      }
    } else if (error.request) {
      // 请求发出但未收到响应
      notification.error({
        message: '网络错误',
        description: '请检查您的网络连接',
      });
    } else {
      // 请求配置出错
      notification.error({
        message: '请求错误',
        description: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// 封装请求方法
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    request.get<BaseResponse<T>>(url, config).then(res => res as T),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    request.post<BaseResponse<T>>(url, data, config).then(res => res as T),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    request.put<BaseResponse<T>>(url, data, config).then(res => res as T),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    request.delete<BaseResponse<T>>(url, config).then(res => res as T),
};

// 导出类型
export type { BaseResponse };
export default request; 