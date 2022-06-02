import axios from 'axios';

export interface Hello {
  code: number;
  data: object;
  msg: string;
}

export function hello() {
  return axios.get('/api/user/hello');
}
