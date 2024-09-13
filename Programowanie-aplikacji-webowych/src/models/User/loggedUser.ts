import { UserRole } from "./user";

export interface LoggedUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
}