import { Injectable } from '@angular/core';
import { Account } from '../model/account';

@Injectable()
export class AccountProvider {
  private static ACCOUNTS: Array<Account> = [
    Account.publicAccount('MtPelerin Public Miner', '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5'),
    Account.publicAccount('MtPelerin BankProject Cold/Miner', '0x459040565c09E9e851F52DBF6DD8689111093211'),
    Account.publicAccount('MtPelerin BankProject Hot', '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a'),
  ];
  
  private active: Account = AccountProvider.ACCOUNTS[2];

  constructor() {
  }

  activeAccount(): Account {
    return this.active;
  }

  allAccounts(): Array<Account> {
    return AccountProvider.ACCOUNTS;
  }

  setActive(account): void {
    this.active = account;
  }
}
