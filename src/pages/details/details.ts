import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  public currency = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  transfer() {

  }

  ionViewDidLoad() {
    this.currency = this.navParams.get('currency');
  }

}
