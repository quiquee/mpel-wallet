declare function require(moduleName: string): any;
const Web3 = require("web3");

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class Web3Provider {
  private web3;
  private latestBlockObs: Observable<any>;
  private pendingBlockObs: Observable<any>;
  private txsSubject: BehaviorSubject<any>;

  private transactions: Array<any> = [];

  blockData(): Observable<any> {
    return this.latestBlockObs;
  }

  pendingBlockData(): Observable<any> {
    return this.pendingBlockObs;
  }

  txsData(): Observable<any> {
    return this.txsSubject;
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
    let transactions = this.transactions;
    let txsSubject = this.txsSubject;
    return Observable.fromPromise(
      Promise.all([
        web3.eth.getTransactionCount(fromAddress),
        web3.eth.getGasPrice(),
        web3.eth.net.getId()
      ]).then(data => {
        let account = web3.eth.accounts.privateKeyToAccount(fromPKey);
        web3.eth.accounts.wallet.add(account);
        console.log(web3.eth.accounts.wallet);
        console.log(account);
        let txParams = {
          from: account.address,
          nonce: data[0],
          gas: 30000,
          gasPrice: data[1],
          to: toAddress,
          chainId: data[2]
        };
        if (value) {
          txParams['value'] = value;
        }
        if (contractData) {
          txParams['data'] = contractData;
          txParams.gas = (300000);
        }
        console.log(txParams);
        return web3.eth.sendTransaction(txParams)
          .on('transactionHash', function (hash) {
            console.log(hash);
            transactions.push({
              from: txParams.from,
              to: txParams.to,
              hash: hash,
              blockNumber: null,
              status: 'CREATED'
            });
            txsSubject.next({ transactions: transactions });
          })
          .on('receipt', function (receipt) {
            transactions.map(tx => {
              if(tx.status=='CREATED' && tx.hash == receipt.transactionHash) {
                tx.status = 'PENDING';
                txsSubject.next({ transactions: transactions });
              }
            });
          })
          //.on('confirmation', function (confirmationNumber, receipt) {})
          .on('error', console.error);
      }));
  }

  private buildLatestBlockObs(): Observable<any> {
    let latestBlockEmitterObs = Observable.create(observer => {
      this.web3.eth.subscribe('newBlockHeaders', (error, value) => {
        if (error) {
          observer.error(error);
        } else {
          this.web3.eth.getBlock(value.number).then(block => {
            this.transactions.map(tx => {
              if(tx.status != 'UNCONFIRMED'
                && block.transactions.filter(tx => tx.transactionHash == tx.hash).length == 1) {
                tx.blockNumber = block.number;
                tx.status='UNCONFIRMED';
                this.txsSubject.next({ transactions: this.transactions });
              }
              if(tx.status=='UNCONFIRMED' && (block.number - tx.blockNumber >= 3)) {
                tx.status='COMPLETED';
                this.txsSubject.next({ transactions: this.transactions });
              }
            });
          });
          observer.next(value);
        }
      });
    });

    return Observable.concat(
      Observable.fromPromise(this.web3.eth.getBlock('latest')),
      latestBlockEmitterObs);
  }

  private buildPendingBlockObs(): Observable<any>  {
    return Observable.interval(1000).flatMap(i => 
      Observable.fromPromise(
        this.web3.eth.getBlock('pending').then(block => {
          this.transactions.map(tx => {
            if(tx.status!='PENDING' 
              && block.transactions.filter(tx => tx.transactionHash == tx.hash).length == 1) {
              tx.status='PENDING';
              this.txsSubject.next({ transactions: this.transactions });
            }
          });
          return block;
        })));
  }

  private buildTxsSubject(): BehaviorSubject<any> {
    return new BehaviorSubject<any>({
      transactions: this.transactions
    });
  }

  constructor() {
    console.log("Starting web3j...");
    this.web3 = new Web3(new Web3.providers.WebsocketProvider("ws://163.172.104.223:1004"));

    this.latestBlockObs = this.buildLatestBlockObs();
    this.pendingBlockObs = this.buildPendingBlockObs();
    this.txsSubject = this.buildTxsSubject();
  }
}