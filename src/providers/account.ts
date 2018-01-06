import { Injectable } from '@angular/core';
import { Account } from '../model/account';
import { Web3Provider } from './web3';

@Injectable()
export class AccountProvider {
  private accounts: Array<Account> = [
    Account.publicAccount('MtPelerin Public Miner', '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5'),
    Account.publicAccount('MtPelerin BankProject Cold/Miner', '0x459040565c09E9e851F52DBF6DD8689111093211'),
    Account.publicAccount('MtPelerin BankProject Hot', '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a'),
    Account.publicAccount('Enrique', '0xf40d14d0B1E06833826f6c3cE27F5CE9b27d4DB5'),
    Account.hotAccount('Wallet Static with Pkey', 
        '0xf5515abe3dE30b9A9b8359e22Ba451B32AB3C40F',
        '0x2b509a3f22fcf5890ce908d49ba20520c9cedc458180148b8fd5970606646513')
  ];
  
  private active: Account = this.accounts[3];

  constructor(web3Provider: Web3Provider) { }

  public activeAccount(): Account {
    return this.active;
  }

  public otherAccounts(account: Account): Array<Account> {
    return this.accounts.filter(account => {
      return account != this.active;
    });
  }

  public allAccounts(): Array<Account> {
    return this.accounts;
  }

  public setActive(account): void {
    this.active = account;
  }
}
