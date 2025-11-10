import { v4 } from "uuid";
import { User, UserWithoutId } from "../types/user";

class UserService {
  private users: Map<string, User> = new Map();

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }
  createUser(userData: UserWithoutId): User {
    const id = v4();
    const newUser: User = {id, ...userData};
    this.users.set(id, newUser);
    return newUser;
  }
  updateUser(id: string, userData: Partial<UserWithoutId>): User | undefined {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    const updateUser: User = {...existingUser, ...userData};
    this.users.set(id, updateUser);
    return updateUser;
  }
  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }
}

export default new UserService();
