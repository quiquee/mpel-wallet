import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {SettingsPage} from "../pages/settings/settings";
import {CurrencyProvider} from '../providers/currency';
import {HttpClientModule} from "@angular/common/http";
import {DetailsPage} from "../pages/details/details";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailsPage,
    SettingsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailsPage,
    SettingsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CurrencyProvider
  ]
})
export class AppModule {

  constructor(private currencyProvider: CurrencyProvider) {
    currencyProvider.initCurrencyProvider();
  }
}
