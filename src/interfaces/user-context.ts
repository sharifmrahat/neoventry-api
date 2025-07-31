import { Role } from './enums/role';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
}
