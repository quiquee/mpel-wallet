import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MoneyProvider} from "../../providers/money/money";
import {MoneyPage} from "../money/money";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  moneys: String[];

  constructor(private navCtrl: NavController, private moneyService: MoneyProvider) {
  }

  ngOnInit(): void {
    this.moneys = this.moneyService.getMoney()
  }

  goToMoneyPage(money: String) {
    this.navCtrl.push(MoneyPage, {money})
  }
}
