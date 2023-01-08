import * as bcrypt from 'bcrypt';

export const BcriptHash = (message: string): string => {
  return bcrypt.hashSync(message, 10);
}

export const BcriptCompare = (checkMessage: string, message: string): boolean => {
  return bcrypt.compareSync(checkMessage, message);
}