import { Injectable } from '@angular/core';
import { Account } from '../model/account';
import { Web3Provider } from './web3';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Injectable()
export class AccountProvider {
  private accounts: Array<Account> = [
    Account.publicAccount('MtPelerin Public Miner', '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5'),
    Account.publicAccount('MtPelerin BankProject Cold/Miner', '0x459040565c09E9e851F52DBF6DD8689111093211'),
    Account.publicAccount('MtPelerin BankProject Hot', '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a'),
    Account.hotAccount('Wallet Static with Pkey',
      '0xf5515abe3dE30b9A9b8359e22Ba451B32AB3C40F',
      '0x2b509a3f22fcf5890ce908d49ba20520c9cedc458180148b8fd5970606646513'),
    Account.publicAccount('Enrique', '0xf40d14d0B1E06833826f6c3cE27F5CE9b27d4DB5')
  ];

  private active: Account = this.accounts[3];

  constructor(private web3Provider: Web3Provider,
    private barcodeScanner: BarcodeScanner) {
  }

  public activeAccount(): Account {
    return this.active;
  }

  private buildAccount(key): Account {
    let account = null;
    if (!key || key.length == Account.PRIVATE_KEY_LENGTH) {
      let internal = null;
      if(key) {
        internal = this.web3Provider.getAccounts().privateKeyToAccount(key);
      } else {
        internal = this.web3Provider.getAccounts().create();
      }
      let name = 'Hot Account';
      let id = this.accounts.filter(account => account.name.startsWith(name)).length;
      if (id > 0) name += ' - ' + (id + 1);
      account = Account.hotAccount(name, internal.address, internal.privateKey);
      account.internal = internal;
    } else if(key.length == Account.PUBLIC_KEY_LENGTH) {
      let name = 'Public Account';
      let id = this.accounts.filter(account => account.name.startsWith(name)).length;
      if (id > 0) name += ' - ' + (id + 1);
      account = Account.publicAccount(name, key);
    } else {
      throw 'Invalid key !';
    }
    this.accounts.push(account);
    return account;
  }

  public createAccount(): Account {
    return this.buildAccount(null);
  }

  public addAccount(): Promise<Account> {
    return this.barcodeScanner.scan().then(barcodeData => {
      return this.buildAccount(barcodeData.text);
    });
  }

  public deleteAccount(): Account {
    return null;
  }

  public otherAccounts(account: Account): Array<Account> {
    return this.accounts.filter(account => {
      return account != this.active;
    });
  }

  public allAccounts(): Array<Account> {
    return this.accounts;
  }

  public getAccount(address: string): Account {
    let result: Account = null;
    this.accounts.forEach(account => {
      if(account.address == address) { result = account; }
    });
    return result;
  }

  public getAccountName(address: string): string {
    let account = this.getAccount(address);
    return (account) ? account.name : address;
  }

  public setActive(account): void {
    this.active = account;
  }
}
