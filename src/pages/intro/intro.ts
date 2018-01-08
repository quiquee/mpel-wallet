import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ProfileProvider} from '../../providers/profile';
import {TabsPage} from '../tabs/tabs';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, private profileProvider: ProfileProvider) {
  }

  closeIntro() {
    this.profileProvider.newProfile();
    this.navCtrl.setRoot(TabsPage);
  }

}
