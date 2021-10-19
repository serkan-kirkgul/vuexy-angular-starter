import { Role } from './role';

export class User {
  id: number;
  email: string;
  agency: string;
  agencyName: string;
  user: string;
  userName: string;
  password: string;
  avatar: string;
  role: Role;
  token?: string;
}
