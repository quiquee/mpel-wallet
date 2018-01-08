import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { ProfileProvider } from '../providers/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, profileProvider: ProfileProvider,
    statusBar: StatusBar, splashScreen: SplashScreen) {
    
    let rootPageReady = profileProvider.getProfile().subscribe(profile => {
      this.rootPage  = (profile) ? TabsPage : IntroPage;
    })

    Promise.all([platform.ready(), rootPageReady]).then(data => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
