import { Component } from '@angular/core';
import { Currency } from '../../model/currency';
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
  public selectedAmount: Number;
  public selectedAccount: Account;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public currencyProvider: CurrencyProvider, public accountProvider: AccountProvider) {
  }

  public transfer() {
    /* Not yet working !
    let currency = this.currencyProvider.getCurrency(this.selectedCurrencySymbol);
    if (currency) {
      try {
        this.currencyProvider.transfer(currency, this.selectedAccount.pubKey, this.selectedAmount);
      } catch(e) {
        console.error(e);
      }
    } else {
      console.error('invalid currency <' + this.selectedCurrencySymbol + '> !')
    }*/
    this.navCtrl.parent.select(0);
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
