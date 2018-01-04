declare function require(moduleName: string): any;
const Web3 = require("web3");
const EthereumTx = require('ethereumjs-tx');

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Buffer } from 'buffer';
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

  getAccounts() {
    return this.web3.eth.accounts;
  }

  getBalance(address: string) {
    return this.web3.eth.getBalance(address);
  }

  sendSignedTransaction(fromAddress: string, fromPKey: string, toAddress: string, value: number, contractData: string) {
    let web3 = this.web3;
    return Observable.fromPromise(
      Promise.all([
        web3.eth.getTransactionCount(fromAddress),
        web3.eth.getGasPrice()
      ]).then(data => {
        let txParams = {
          nonce: web3.utils.toHex(data[0]),
          gas: web3.utils.toHex(30000),
          gasPrice: web3.utils.toHex(data[1]),
          to: toAddress,
        };
        if (value) {
          txParams['value'] = value;
        }
        if (contractData) {
          txParams['data'] = contractData;
          txParams.gas = web3.utils.toHex(300000);
        }
        console.log(txParams);
        const tx = new EthereumTx(txParams);
        tx.sign(Buffer(fromPKey, 'hex'));
        return web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'))
          .on('transactionHash', function (hash) {
            console.log(hash);
          })
          .on('receipt', function (receipt) {
            console.log(receipt);
          })
          .on('confirmation', function (confirmationNumber, receipt) {
            console.log('Confirmation: ');
            console.log(confirmationNumber);
            console.log(receipt);
            return receipt;
          })
          .on('error', console.error);
      }));
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