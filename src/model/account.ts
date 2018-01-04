
import { Currency } from './currency';
import { Transfer } from './transfer';

export enum AccountType {
  PUBLIC, MULTISIG, COLD, HOT
}

export class Account { 
  name: string;
  pubKey: string;
  pKey: string;
  type: AccountType;

  internal: any;

  portfolio: { currency: Currency, balance: number, transfers: Transfer[] }[];
  
  public static publicAccount(name: string, pubKey: string) : Account {
    return { name: name, pubKey: pubKey, pKey: null, internal: null,
      type: AccountType.PUBLIC,
      portfolio: [] };
  }

  public static hotAccount(name: string, pubKey: string, pKey: string) : Account {
    return { name: name, pubKey: pubKey, pKey: pKey, internal: null,
      type: AccountType.HOT, 
      portfolio: [] };
  }

  static coldAccount() {
    // Pkey is stored but encrypted with a strong mecanism
    // Require a 2FA
    throw "Not yet implemented !";
  }

  static multisigAccount() {
    // Contract address is needed
    // GUI must shows unlocking status progression
    throw "Not yet implemented !";
  }

}