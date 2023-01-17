import * as bcrypt from 'bcrypt';
export const secretSalt = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeKcfnEI8MdWhTWcMuHJLgxty';
export const BcriptHash = (message: string): string => {
  const MessagewithSalt = message + secretSalt;
  return bcrypt.hashSync(MessagewithSalt, 10);
}

export const BcriptCompare = (checkMessage: string, message: string): boolean => {
  const MessagewithSalt = checkMessage + secretSalt;
  return bcrypt.compareSync(MessagewithSalt, message);
}