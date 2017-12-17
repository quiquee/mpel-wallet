import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountProvider} from '../../providers/account';

@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public accountProvider: AccountProvider) {

  }

  selectAccount(account) {
    this.accountProvider.setActive(account);
    this.navCtrl.parent.select(0);
  }
}
