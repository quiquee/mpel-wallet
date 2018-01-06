
import { Currency } from './currency';
import { Transfer } from './transfer';

export enum AccountType {
  PUBLIC, MULTISIG, COLD, HOT
}

export class Account { 
  name: string;
  address: string;
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

  constructor(name: string, address: string, pKey: string) {
    this.name = name;
    this.address = address;
    this.pKey = pKey;
  }
  
  public static publicAccount(name: string, address: string) : Account {
    return new Account(name, address, null);
  }

  public static hotAccount(name: string, address: string, pKey: string) : Account {
    return new Account(name, address, pKey);
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