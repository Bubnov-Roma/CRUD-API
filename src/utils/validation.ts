import { validate as uuidValidate } from 'uuid';
import { UserWithoutId } from '../types/user';

export const isValidUUID = (id: string): boolean => {
  return uuidValidate(id);
};

export const isValidUserData = (data: any): data is UserWithoutId => {
  return (
    data &&
    typeof data.username === 'string' &&
    typeof data.age === 'number' &&
    Array.isArray(data.hobbies) &&
    data.hobbies.every((hobby: any) => typeof hobby === 'string')
  );
};

export const isUserUpdateData = (data: any): boolean => {
  return (
    data &&
    (typeof data.username === 'string' ||
      typeof data.age === 'number' ||
      (Array.isArray(data.hobbies) && data.hobbies.every((hobby: any) => typeof hobby === 'string')))
  );
};