import React from 'react';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrent();
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'Create or modify data success.',
  202: 'A request has entered the background queue (asynchronous task)',
  204: 'Delete data successfully.',
  400: 'There is an error in the request sent, and the server did not create or modify data.',
  401: 'The user does not have permission (the token, username, password are wrong).',
  403: 'The user is authorized, but access is forbidden.',
  404: 'The request sent is for a record that does not exist, no action taken on server.',
  405: 'The requested method is not allowed.',
  406: 'The requested format is not available.',
  410: 'The requested resource has been permanently deleted and will no longer be available.',
  422: 'A validation error occurred when creating an object.',
  500: 'An error occurred in the server, please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable, the server is temporarily overloaded or under maintenance.',
  504: 'The gateway has timed out.',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Request Error ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: 'Your network is abnormal, cannot connect to server',
      message: 'Network error',
    });
  }
  throw error;
};
/**
 * Add Token for request
 */
const addTokenInterceptor = (url: null | string, options: RequestOptionsInit) => {
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return {
    url: `${url}`,
    options: {
      ...options,
      interceptors: true,
    },
  };
};
/**
 * Print headers in response
 */
// const responseInterceptor = (response: Response, options: RequestOptionsInit) => {
//   return response;
// };

export const request: RequestConfig = {
  errorHandler, // 默认错误处理
  requestInterceptors: [addTokenInterceptor],
  // responseInterceptors: [responseInterceptor]
};
