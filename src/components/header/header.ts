import { Component } from '@angular/core';
import { StatusProvider } from '../../providers/status';
import { Web3Provider } from '../../providers/web3';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  public blockNumber;

  constructor(private statusProvider: StatusProvider,
    private web3Provider: Web3Provider) {
      this.web3Provider.blockData().map(data => {
        this.blockNumber = data.number;
      }).subscribe();
  }
}
