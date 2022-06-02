export type MenuType = {
  id: number;
  parentId: number;
  localeKey: string;
  description: string;
  path: string;
  componentName: string;
  type: string;
  permissionKey: string;
  icon: string;
  sortOrder: number;
  state: string;
  createDt: string;
  createBy: string;
  updateDt: string;
  updateBy: string;
}



export interface UserState {
  loginName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  sex?: string;
  birthday?: string;
  createDt?:string;
  roleKeys?:Array<string>;
  menus?:Array<MenuType>;
  permissionKeys?: Set<string>;
}
