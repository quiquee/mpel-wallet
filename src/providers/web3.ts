declare function require(moduleName: string): any;
const Web3 = require("web3");
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class Web3Provider {
  private web3;
  private latestBlockObs: Observable<any>;

  blockData(): Observable<any> {
    return this.latestBlockObs;
  }

  public getContract(abi: any, address: string): any {
    return new this.web3.eth.Contract(abi, address);
  }

  getUtils() {
    return this.web3.utils;
  }

  getBalance(address: string) {
    return this.web3.eth.getBalance(address);
  }

  unlockAccount(address: string, password: string) {
    return this.web3.eth.personal.unlockAccount(address, password);
  }

  constructor() {
    console.log("Starting web3j...");
    this.web3 = new Web3(new Web3.providers.WebsocketProvider("ws://163.172.104.223:1004"));

    let latestBlockEmitterObs = Observable.create(observer => {
      this.web3.eth.subscribe('newBlockHeaders', function (error, value) {
        if (error) {
          observer.error(error);
        } else {
          observer.next(value);
        }
      });
    });

    this.latestBlockObs = Observable.concat(
      Observable.fromPromise(this.web3.eth.getBlock('latest')),
      latestBlockEmitterObs);

  }
}