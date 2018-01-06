import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountProvider} from '../../providers/account';
import { FormatProvider } from '../../providers/format';
import { TransferPage } from "../transfer/transfer";
import { Account } from '../../model/account';

@Component({
  selector: 'page-accounts-details',
  templateUrl: 'accounts-details.html',
})
export class AccountsDetailsPage {
  account = new Account(null, null, null);

  constructor(private accountProvider: AccountProvider, 
    public formatProvider: FormatProvider,
    public navCtrl: NavController, public navParams: NavParams) {

  }

  startTransfer(token, event: FocusEvent) {
    event.stopPropagation();
    this.navCtrl.push(TransferPage, { token });
  }

  ionViewWillEnter() {
    this.account = this.navParams.get('account');
  }
}
