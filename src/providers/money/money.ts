import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class MoneyProvider {

  constructor(private http: HttpClient) {
    console.log('Hello MoneyProvider Provider');
  }

  public getMoney() {
    return [
      "USD", "EUR", "GBP", "CHF"
    ]
  }

}
