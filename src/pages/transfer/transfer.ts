import { Component } from '@angular/core';
import { Account } from '../../model/account';
import { Currency } from '../../model/currency';
import { CurrencyProvider } from '../../providers/currency';
import { NavController, NavParams } from 'ionic-angular';
import { AccountProvider } from '../../providers/account';

@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html'
})
export class TransferPage {
  activeAccount: Account;

  public selectedToken: { currency: Currency, balance: number };
  public selectedCurrencySymbol: string;
  public selectedAmount: number;
  public selectedAccount: Account;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public currencyProvider: CurrencyProvider, public accountProvider: AccountProvider) {
    this.activeAccount = this.accountProvider.activeAccount();
  }

  ionViewDidLoad() {
    let token = this.navParams.get('token');
    if (token) {
      this.selectedToken = token;
      this.selectedCurrencySymbol = token.currency.symbol;
    }
    this.activeAccount = this.accountProvider.activeAccount();
  }

  public transfer() {
    let token =
      this.activeAccount.portfolio.filter(element => 
        element.currency.symbol == this.selectedCurrencySymbol
      )[0];

    token.currency.transfer(
      this.activeAccount,
      this.selectedAccount,
      this.selectedAmount
    );
    this.navCtrl.popToRoot();
  }

  public getPositivePortfolio() {
    return this.activeAccount.portfolio.filter(element => element.balance > 0);
  }
}
