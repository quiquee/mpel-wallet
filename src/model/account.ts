
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

  canSend(currency): boolean {
    return this.pKey 
      && this.portfolio.filter(item => {
        return item.currency == currency && item.balance > 0;
      }).length > 0;
  };

  constructor(name: string, pubKey: string, pKey: string) {
    this.name = name;
    this.pubKey = pubKey;
    this.pKey = pKey;
  }
  
  public static publicAccount(name: string, pubKey: string) : Account {
    return new Account(name, pubKey, null);
  }

  public static hotAccount(name: string, pubKey: string, pKey: string) : Account {
    return new Account(name, pubKey, pKey);
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