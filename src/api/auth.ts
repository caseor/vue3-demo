import axios from 'axios';

export interface LoginData {
  loginName: string;
  password: string;
}

export interface LoginRes {
  token: string
}
export function token(data: LoginData) {
  return axios.post<LoginRes>('/api/auth/token', data);
}

export function invalidateToken() {
  return axios.delete<any>('/api/auth/token');
}
