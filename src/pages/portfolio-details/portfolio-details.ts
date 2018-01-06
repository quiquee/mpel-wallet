import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountProvider} from '../../providers/account';
import { FormatProvider } from '../../providers/format';
import { TransferPage } from "../transfer/transfer";
import { Account } from '../../model/account';

@Component({
  selector: 'page-portfolio-details',
  templateUrl: 'portfolio-details.html',
})
export class PortfolioDetailsPage {
  activeAccount = new Account(null, null, null);
  token = { currency: {}, balance: 0, transfers: [] };
  history: Array<any>;

  constructor(private accountProvider: AccountProvider, 
    public formatProvider: FormatProvider,
    public navCtrl: NavController, public navParams: NavParams) {
      this.history = [
        { amount: 100.00, from: null, to: '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5' },
        { amount: 24.00, from: null, to: '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a' },
        { amount: 99.99, from: null, to: '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a' },
        { amount: 100, from: '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5', to: null },
        { amount: 100, from: '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5', to: null },
        { amount: 100, from: null, to: '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a' },
      ];
  }

  startTransfer(token, event: FocusEvent) {
    event.stopPropagation();
    this.navCtrl.push(TransferPage, { token });
  }

  ionViewWillEnter() {
    this.token = this.navParams.get('token');
    this.activeAccount = this.accountProvider.activeAccount();
    /*this.history = this.activeAccount.portfolio.filter(item => 
      item.currency == this.token.currency
    );*/
  }
}
