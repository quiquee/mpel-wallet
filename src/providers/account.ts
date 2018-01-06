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
    console.log(this.active.address.length);
    console.log(this.active.pKey.length);
  }

  public activeAccount(): Account {
    return this.active;
  }

  public createAccount(): Account {
    let internal = this.web3Provider.getAccounts().create();
    let name = 'Hot Account';
    let id = this.accounts.filter(account => account.name.startsWith(name)).length;
    if (id > 0) name += ' - ' + (id + 1);
    let account = Account.hotAccount(name, internal.address, internal.privateKey);
    account.internal = internal;
    this.accounts.push(account);
    return account;
  }

  public addAccount(): Promise<Account> {
    return this.barcodeScanner.scan().then(barcodeData => {
      let account = null;
      if (barcodeData.text.length == 66) {
        let internal = this.web3Provider.getAccounts().privateKeyToAccount(barcodeData.text);
        let name = 'Hot Account';
        let id = this.accounts.filter(account => account.name.startsWith(name)).length;
        if (id > 0) name += ' - ' + (id + 1);
        account = Account.hotAccount(name, internal.address, internal.privateKey);
        account.internal = internal;
      } else if(barcodeData.text.length == 42) {
        let name = 'Public Account';
        let id = this.accounts.filter(account => account.name.startsWith(name)).length;
        if (id > 0) name += ' - ' + (id + 1);
        account = Account.publicAccount(name, barcodeData.text);
      } else {
        throw 'Invalid key !';
      }
      this.accounts.push(account);
      return account;
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

  public setActive(account): void {
    this.active = account;
  }
}
