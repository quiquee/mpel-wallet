import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountProvider} from '../../providers/account';
import { AccountsDetailsPage } from '../accounts-details/accounts-details';

@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public accountProvider: AccountProvider) {

  }

  createAccount() {
    this.accountProvider.createAccount();
  }

  addAccount() {
    this.accountProvider.addAccount();
  }

  goToDetailsPage(event, account) {
    console.log(event);
    event.stopPropagation();
    this.navCtrl.push(AccountsDetailsPage, { account });
  }

  selectAccount(account) {
    this.accountProvider.setActive(account);
    this.navCtrl.parent.select(0);
  }
}
