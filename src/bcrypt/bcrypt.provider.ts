import * as bcrypt from 'bcrypt';
import { BCRYPT } from './bcrypt.const';

export type Bcrypt = typeof bcrypt;

export const BcryptProvider = {
  provide: BCRYPT,
  useValue: bcrypt,
};
