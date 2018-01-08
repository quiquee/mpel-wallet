import { Injectable } from '@angular/core';
import { Transaction } from '../model/transaction';
import { Observable } from 'rxjs/Observable';

import { AccountProvider } from '../providers/account'; 

@Injectable()
export class TransactionProvider {

  private transactionsMap: Map<string, Array<Transaction>> = new Map();

  constructor(private accountProvider: AccountProvider) {
    let transactions = [
      { amount: 100.00, from: null, to: '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5' },
      { amount: 24.00, from: null, to: '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a' },
      { amount: 99.99, from: null, to: '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a' },
      { amount: 100, from: '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5', to: null },
      { amount: 100, from: '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5', to: null },
      { amount: 100, from: null, to: '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a' },
    ].map(item => {
      let tx = new Transaction();
      tx.from = this.accountProvider.getAccountName(item.from);
      tx.to = this.accountProvider.getAccountName(item.to);
      tx.amount = item.amount;
      tx.timestamp = new Date().getMilliseconds();
      return tx;
    });
    this.transactionsMap.set('0x012345', transactions);
  }

  getHistory(address: string): Observable<Array<Transaction>> {
    return Observable.of(this.transactionsMap.get('0x012345'));
  }
}
