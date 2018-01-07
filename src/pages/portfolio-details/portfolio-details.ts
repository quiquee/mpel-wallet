import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AccountProvider } from '../../providers/account';
import { TransactionProvider } from '../../providers/transaction';
import { FormatProvider } from '../../providers/format';
import { TransferPage } from "../transfer/transfer";
import { Account } from '../../model/account';
import { Transaction } from '../../model/transaction';

@Component({
  selector: 'page-portfolio-details',
  templateUrl: 'portfolio-details.html',
})
export class PortfolioDetailsPage {
  activeAccount = new Account(null, null, null);
  token = { currency: {}, balance: 0, transfers: [] };
  history: Array<Transaction> = [];

  constructor(private accountProvider: AccountProvider,
    private transactionProvider: TransactionProvider,
    public formatProvider: FormatProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  startTransfer(token, event: FocusEvent) {
    event.stopPropagation();
    this.navCtrl.push(TransferPage, { token });
  }

  ionViewWillEnter() {
    this.token = this.navParams.get('token');
    this.activeAccount = this.accountProvider.activeAccount();
    this.transactionProvider.getHistory(this.activeAccount.address).subscribe(
      history => this.history = history
    );
  }
}
