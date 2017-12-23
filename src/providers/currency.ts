declare function require(moduleName: string): any;
const Web3 = require("web3");
const MtPelerinTokens = require('../assets/contracts/MtPelerinTokens.json');
const FiatToken = require('../assets/contracts/FiatToken.json');

import { Injectable } from '@angular/core';
import { AccountProvider } from './account';
import { Account } from '../model/account';
import { Currency } from '../model/currency';

@Injectable()
export class CurrencyProvider {
  public web3: any;
  public ethFilters: Array<any> = [];
  private currencies: Array<Currency> = [];

  private static TOKENS_CONTRACT_ADDR = '0x73b10223b2318cfb775fbe7bc5781a04c2a0a3cd';

  constructor(private accountProvider: AccountProvider) {
  }

  public allCurrencies(): Array<Currency> {
    return this.currencies;
  }

  public getCurrency(symbol: String): Currency {
    return this.currencies.filter(currency => {
      return currency.symbol == symbol;
    })[0];
  }

  async loadTokens() {
    this.currencies = [];

    let contract = new this.web3.eth.Contract(MtPelerinTokens.abi, CurrencyProvider.TOKENS_CONTRACT_ADDR);
    let count = await contract.methods.getCurrencyCount().call();
    console.log('Found ' + count + ' tokens !');
    let ethBalance = await this.web3.eth.getBalance(this.accountProvider.activeAccount().pubKey)
      .then((value) => {
        return Math.round((this.web3.utils.fromWei(value, "ether") * 100) / 100).toFixed(2);
      });
    this.currencies = [{
      name: 'Ethereum', balance: ethBalance, decimal: null,
      address: null, contract: null, supply: null, symbol: 'ETH', image: 'ETH'
    }];

    for (var i = 1; i <= count; i++) {
      let address = await contract.methods.getCurrencyById(i).call();

      let token : Currency = { name: null, balance: null, decimal: 2, address: address, contract: null, supply: null, symbol: null, image: null, history: [] };
      token.contract = new this.web3.eth.Contract(FiatToken.abi, address);
      token.name = await token.contract.methods.name().call();
      token.symbol = this.web3.utils.toAscii(await token.contract.methods.symbol().call());
      token.supply = await token.contract.methods.totalSupply().call() / 100;
      token.image = 'MTPELERIN';

      event = token.contract.events.allEvents({ fromBlock: 1, toBlock: 'latest', address: token.address }, function (error, result) {
        if (error) {
          console.error(token.symbol.toUpperCase() + ' ERROR: ' + JSON.stringify(error));
        } else {
          switch (result.event) {
            case 'Transfer':
              let returnValues = result.returnValues;
              token.history.push({
                amount: returnValues.value,
                from: returnValues.from,
                to: returnValues.to,
                blockNumber: returnValues.blockNumber
              })
              break;
            default:
              console.log(token.symbol.toUpperCase() + ' RESULT:' + JSON.stringify(result));
/*              token.logs[result.event].push({
                blockNumber: result.blockNumber,
                from: result.re
              });*/
          }
        }
      });
      this.refreshBalance(token);
      this.currencies.push(token);
    }
  }

  async refreshBalance(token) {
    let balance = await token.contract.methods.balanceOf(this.accountProvider.activeAccount().pubKey).call() / 100;
    token.balance = (balance) ? balance : 0;
  }

  private async transferEth(beneficiary: Account, amount: number) {
    let sender = this.accountProvider.activeAccount();
    if (sender.pKey) {
      console.log(amount + ' eth to ' + beneficiary.name);
      await this.web3.eth.personal.unlockAccount(sender.pubKey, 'password');
      await this.web3.eth.sendTransaction({
        from: sender.pubKey,
        to: beneficiary.pubKey,
        value: this.web3.utils.toWei(amount, 'ether')
      }).then(result => {
        console.log(result);
      }).catch(error => {
        console.error(error);
      });
    }
  }

  private async transferERC20(currency: Currency, beneficiary: Account, amount: number) {
    let sender = this.accountProvider.activeAccount();
    if (sender.pKey) {
      console.log(amount + ' ' + currency.symbol + ' to ' + beneficiary.name);
      let cents = amount * (10 ** currency.decimal);
      await this.web3.eth.personal.unlockAccount(sender.pubKey, 'password');
      await currency.contract.methods.transfer(beneficiary.pubKey, cents).send({ from: sender.pubKey }).then(result => {
        console.log(result);
      }).catch(error => {
        console.error(error);
      });
    }
  }

  public transfer(currencySymbol: String, beneficiary: Account, amount: number) {
    if (currencySymbol == 'ETH') {
      return this.transferEth(beneficiary, amount);
    } else {
      let currency = this.getCurrency(currencySymbol);
      return this.transferERC20(currency, beneficiary, amount);
    }
  }

  public subscription: any;

  initCurrencyProvider() {
    console.log("Starting web3j...");
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      //this.web3 = new Web3(
      //  new Web3.providers.HttpProvider("./node"));

      this.web3 = new Web3(new Web3.providers.WebsocketProvider("ws://163.172.104.223:1004"));
    }

    ['logs', 'pendingTransactions', 'newBlockHeaders', 'syncing'].forEach(type => {
      console.log('Registering event type ' + type.toUpperCase());

      let event;
      if (type == 'logs') {
        /* event = this.web3.eth.subscribe(type, 
           { fromBlock: 10000, address: '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a',
           topics: [ null, '0x489947c6508d992515dde491c5b203911c2b5c0f' ]
         }, function (error, result) {
           if (error) {
             console.log('#' + error + '#')
             console.error(type.toUpperCase() + ' ERROR: ' + JSON.stringify(error));
           } else {
             console.log(type.toUpperCase() + ' RESULT:' + JSON.stringify(result));
           }
         });*/
      } else {
        /*        event = this.web3.eth.subscribe(type, function (error, result) {
                  if (error) {
                    console.error(type.toUpperCase() + ' ERROR: ' + JSON.stringify(error));
                  } else {
                    console.log(type.toUpperCase() + ' RESULT:' + JSON.stringify(result));
                  }
                });*/
      }
      /** Events subscription for chain tracking **/
      /*event.on('data', (object) => {
        console.log(type.toUpperCase() + ' DATA: ' + JSON.stringify(object));
      });
      event.on('changed', (object) => {
        console.log(type.toUpperCase() + ' CHANGED: ' + JSON.stringify(object));
      });
      event.on('error', (object) => {
        console.log(type.toUpperCase() + ' ERROR: ' + JSON.stringify(object));
      });*/
    });
    this.subscription = this.web3.eth.subscribe('logs', {
      fromBlock: 1, toBlock: 'latest',
      topics: ['']
    }, function (error, data) {
      console.log(error);
    })
      .on("data", function (trxData) {
        function formatAddress(data) {
          var step1 = this.web3.utils.hexToBytes(data);
          for (var i = 0; i < step1.length; i++) if (step1[0] == 0) step1.splice(0, 1);
          return this.web3.utils.bytesToHex(step1);
        }

        console.log("Register new transfer: " + trxData.transactionHash);
        console.log("Contract " + trxData.address + " has transaction of "
          + this.web3.utils.hexToNumberString(trxData.data) + " from " + formatAddress(trxData.topics['1'])
          + " to " + formatAddress(trxData.topics['2']));
        //console.log(trxData);
        this.web3.eth.getTransactionReceipt(trxData.transactionHash, function (error, reciept) {
          console.log('Sent by ' + reciept.from + ' to contract ' + reciept.to);
        });
      });

  }
}
