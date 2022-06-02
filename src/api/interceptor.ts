import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken, setToken } from '@/utils/auth';

export interface HttpResponse<T = any> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

// if (import.meta.env.VITE_API_BASE_URL) {
//   axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// }

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.GmsbAuth = `Gmsb ${token}`;
    }
    config.timeout = 5000
    return config;
  },
  (error) => {
    // do something
    console.log("error: ", error)
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // console.log("interceptor: ", res)

    // 判断是否需要Token刷新
    if (res.code === 50000) {
      // 刷新Token（可以使用同步操作）
      // 将新的Token设置到axios的默认请求头
      // axios.defaults.headers.common.token = res.data.refreshedJwt;

      // 将新的Token设置到重发的请求头
      // response.config.headers.Authorization = res.data.refreshedJwt;
      setToken(res.data.refreshedJwt);
      if (!response.config.headers) {
        response.config.headers = {};
      }
      response.config.headers.GmsbAuth = `Gmsb ${res.data.refreshedJwt}`;
      // 请求重发
      return axios.request(response.config);
    }

    // console.log("res: ", res)

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message.error({
        content: res.msg || 'Error',
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        [50008, 50012, 50014].includes(res.code) &&
        response.config.url !== '/api/user/info'
      ) {
        Modal.error({
          title: 'Confirm logout',
          content:
            'You have been logged out, you can cancel to stay on this page, or log in again',
          okText: 'Re-Login',
          async onOk() {
            const userStore = useUserStore();

            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000,
    });
    console.log("bottom error: ", error)
    return Promise.reject(error);
  }
);
