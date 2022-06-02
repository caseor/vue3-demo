import axios from 'axios';
import {MenuType, UserState} from '@/store/modules/user/types';

export type UserInfoResType = {
  user: UserState;
  roleKeys:Array<string>;
  menus:Array<MenuType>;
  permissionKeys:Set<string>;
}


export function getUserInfo() {
  return axios.get<UserInfoResType>('/api/user/info');
}

export function hello() {
  return axios.get<UserState>('/api/user/hello');
}
