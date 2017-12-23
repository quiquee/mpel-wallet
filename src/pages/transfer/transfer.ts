import { Component } from '@angular/core';
import { Account } from '../../model/account';
import { CurrencyProvider } from '../../providers/currency';
import { NavController, NavParams } from 'ionic-angular';
import { AccountProvider } from '../../providers/account';

@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html'
})
export class TransferPage {

  public selectedCurrencySymbol: String;
  public selectedAmount: number;
  public selectedAccount: Account;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public currencyProvider: CurrencyProvider, public accountProvider: AccountProvider) {
  }

  ionViewDidLoad() {
    let currency = this.navParams.get('currency');
    if(currency) {
      this.selectedCurrencySymbol = currency.symbol;
    }
  }

  public transfer() {
    this.currencyProvider.transfer(
      this.selectedCurrencySymbol,
      this.selectedAccount,
      this.selectedAmount
    );
    this.navCtrl.popToRoot();
  }

  public getCurrenciesWithBalance() {
    return this.currencyProvider.allCurrencies().filter(currency => {
      return currency.balance > 0;
    });
  }

  public getBalance() {
    if (this.selectedCurrencySymbol) {
      return this.currencyProvider.getCurrency(this.selectedCurrencySymbol).balance;
    }
  }
}
