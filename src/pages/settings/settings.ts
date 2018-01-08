import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ProfileProvider} from '../../providers/profile';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public confirmations: number = 3;

  constructor(private profileProvider: ProfileProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  clearData() {
    this.profileProvider.clearProfile();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
