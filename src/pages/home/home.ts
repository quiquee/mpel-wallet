import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CurrencyProvider} from "../../providers/currency";
import {DetailsPage} from "../details/details";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private navCtrl: NavController, private currencyService: CurrencyProvider) {
  }

  goToDetailsPage(money: String) {
    this.navCtrl.push(DetailsPage, {money})
  }
}
