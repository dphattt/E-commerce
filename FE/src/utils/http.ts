import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
});

const _send = async <T>(
  method: string,
  path: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await httpClient.request<{ data: T }>({
    ...config,
    method,
    url: path,
    data,
  });

  return response.data.data;
};

httpClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const get = async <T>(path: string, config?: AxiosRequestConfig): Promise<T> => {
  return _send<T>("get", path, undefined, config);
};

const post = async <T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return _send<T>("post", path, data, config);
};

const put = async <T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return _send<T>("put", path, data, config);
};

const patch = async <T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return _send<T>("patch", path, data, config);
};

const del = async <T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return _send<T>("delete", path, data, config);
};

const http = { get, post, put, patch, del };
export default http;