import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountProvider} from '../../providers/account';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  activeAccount;
  token = { currency: {}, balance: 0, transfers: [] };

  constructor(private accountProvider: AccountProvider, 
    public navCtrl: NavController, public navParams: NavParams) {
    this.activeAccount = this.accountProvider.activeAccount();
  }

  transfer() {

  }

  ionViewDidLoad() {
    this.token = this.navParams.get('token');
  }

}
