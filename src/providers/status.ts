import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Web3Provider } from './web3';

@Injectable()
export class StatusProvider {
    private statusObservable: Observable<any>;


    constructor(private web3Provider: Web3Provider) {
    }


    synchronize() {
        //   this.statusObservable = Observable.
    }

    public getObservable(): Observable<any> {
        return this.statusObservable;
    }
}