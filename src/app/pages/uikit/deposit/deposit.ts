import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-deposit',
  imports: [TranslatePipe,ButtonModule, ButtonGroupModule, SplitButtonModule, SelectModule, CommonModule, FormsModule, FluidModule, ImageModule, ToastModule,ToastModule,DialogModule],
  templateUrl: './deposit.html',
  styleUrl: './deposit.scss',
  providers: [MessageService]
})
export class Deposit {
  items: MenuItem[] = [];

  loading = [false, false, false, false];
  selectedCoin: any = null;
  CoinsList: any[] = [
      { name: "bitcoin", code: "btc", image: "assets/demo/images/deposit/BTC.png" },
      { name: "ethereum", code: "eth", image: "assets/demo/images/deposit/ETH.png", scan: "assets/demo/images/scan/ETHV2.jpg", address: "0x42b888f7E3B9d11e41C96D40d54a5A2DcCCB90bb" },
      { name: "tetherBEP20", code: "usdt(bep20)", image: "assets/demo/images/deposit/USDT.png" },
      { name: "tetherTRC20", code: "usdt(trc20)", image: "assets/demo/images/deposit/USDT.png" },
      { name: "binancecoin", code: "bnb", image: "assets/demo/images/deposit/BNB.png" },
      { name: "ripple", code: "xrp", image: "assets/demo/images/deposit/XRP.png" },
      { name: "usd-coin", code: "usdc", image: "assets/demo/images/deposit/USDC.png" },
      { name: "solana", code: "sol", image: "assets/demo/images/deposit/SOL.png" },
      { name: "dogecoin", code: "doge", image: "assets/demo/images/deposit/DOGE.png" },
      { name: "litecoin", code: "ltc", image: "assets/demo/images/deposit/LTC.png" }
  ];
  currentSelectedCoin: any = null;
  selectedCoinAddress: string = '';
  selectedCoinImage: string = '';
  selectedCoins: any[] = [
      { address: "bc1qvy0dcma43700hsnjgxnf56a33rc8naru583e9s", name: "bitcoin", code: "btc", scan: "assets/demo/images/scan/BTCV2.jpg" },
      { address: "0x42b888f7E3B9d11e41C96D40d54a5A2DcCCB90bb", name: "ethereum", code: "eth", scan: "assets/demo/images/scan/ETHV2.jpg" },
      { address: "0x5098aA32b08A5908d2e0f4cCB407aF6910A8494f", name: "tetherBEP20", code: "usdt(bep20)", scan: "assets/demo/images/scan/usdtBep20.png" },
      { address: "TJ3iZrJhW3DRCuJvTAvx8votAAAzBs8R7D", name: "tetherTRC20", code: "usdt(trc20)", scan: "assets/demo/images/scan/usdtTrc20.png" },
      { address: "0x5098aA32b08A5908d2e0f4cCB407aF6910A8494f", name: "binancecoin", code: "bnb", scan: "assets/demo/images/scan/BNB.png" },
      { address: "rB6Cxi2XzHbpfajucYgMCnTY5xJucjKvMP", name: "ripple", code: "xrp", scan: "assets/demo/images/scan/XRP.png" },
      { address: "0x5098aA32b08A5908d2e0f4cCB407aF6910A8494f", name: "usd-coin", code: "usdc", scan: "assets/demo/images/scan/UsdcBCP20.png" },
      { address: "4jmKBg3tbagtidG6D3TFdfXCMftaNiFMtv4HqWGFwKX6", name: "solana", code: "sol", scan: "assets/demo/images/scan/SOL.png" },
      { address: "DECfdniei6LEERbMZzzeZ5Y1eLr88vctRa", name: "dogecoin", code: "doge", scan: "assets/demo/images/scan/DOGE.png" },
      { address: "ltc1qxnhuxntzm473hzy3uf56xf9qwk2z8e0emtlz27", name: "litecoin", code: "ltc", scan: "assets/demo/images/scan/LTC.png" }
  ]
  showFaithDepositDialog = false;
  faithDepositEnabled = true;
  faithWireDetailUK = [
      { label: 'Recipient',         value: 'ECOMGLOBALCART LTD',                                                          copyLabel: 'Recipient' },
      { label: 'Currency Accepted', value: 'USD',                                                                         copyLabel: 'Currency accepted' },
      { label: 'IBAN',              value: 'GB33 REVO 0099 6960 5160 20',                                                 copyLabel: 'IBAN' },
      { label: 'BIC',               value: 'REVOGB21',                                                                    copyLabel: 'BIC' },
      { label: 'Intermediary BIC',  value: 'CHASGB2L',                                                                    copyLabel: 'Intermediary BIC' },
      { label: 'Recipient Address', value: 'Office 12 Initial Business Centre, 12, M40 8WN, Manchester, United Kingdom',  copyLabel: 'Recipient address' },
      { label: 'Bank Name',         value: 'Revolut Ltd',                                                                 copyLabel: 'Bank name' },
      { label: 'Bank Address',      value: '30 South Colonnade, E14 5HX, London, United Kingdom',                         copyLabel: 'Bank address' }
  ];
  faithWireDetailUS = [
      { label: 'Business Name',     value: 'PT Global Excel Trading',                          copyLabel: 'Business name' },
      { label: 'Business Address',  value: '802 S Broadway, Los Angeles, CA 90014',            copyLabel: 'Business address' },
      { label: 'Account Number',    value: '793717154741',                                     copyLabel: 'Account number' },
      { label: 'Beneficiary Bank',  value: 'SSB Bank',                                         copyLabel: 'Beneficiary bank' },
      { label: 'Routing Number',    value: '043087080',                                        copyLabel: 'Routing number' },
      { label: 'SWIFT',             value: 'SSBAUS32',                                         copyLabel: 'SWIFT' },
      { label: 'Bank Address',      value: '8700 Perry Highway, 15237, PA, US',                copyLabel: 'Bank address' }
  ];
  constructor(private service: MessageService,private router: Router) { }

  ngOnInit() {
      this.items = [{ label: 'Update', icon: 'pi pi-refresh' }, { label: 'Delete', icon: 'pi pi-times' }, { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' }, { separator: true }, { label: 'Setup', icon: 'pi pi-cog' }];
      this.initializeSelectedValues();
  }
  initializeSelectedValues() {
      this.selectedCoin = this.CoinsList.find(coin => coin.code === 'eth');
      this.selectedCoinImage = this.selectedCoin.scan;
      this.selectedCoinAddress = this.selectedCoin.address;
  }

  load(index: number) {
      this.loading[index] = true;
      setTimeout(() => (this.loading[index] = false), 1000);
  }

  onCoinChange(event: any) {
      console.log(event);
      this.currentSelectedCoin = this.selectedCoins.find(coin => coin.code === event.code);
      this.selectedCoinAddress = this.currentSelectedCoin.address;
      this.selectedCoinImage = this.currentSelectedCoin.scan;
  }
  copyToClipboard(text: string, label?: string) {
      navigator.clipboard.writeText(text);
      this.service.add({
          severity: 'success',
          summary: 'Copied',
          detail: label ? `${label} copied to clipboard.` : 'Copied to clipboard successfully.'
      });
  }
  copyFaithField(text: string, label: string, event: Event): void {
      event.stopPropagation();
      this.copyToClipboard(text, label);
  }
  openFaithDepositDialog(): void {
      if (this.faithDepositEnabled) {
          this.showFaithDepositDialog = true;
      }
  }
  closeFaithDepositDialog(): void {
      this.showFaithDepositDialog = false;
  }
  onBackToDashboard(): void {
      this.showFaithDepositDialog = false;
      this.router.navigate(['/app/dashboard']);
  }
  get faithWireDetails() {
          const region = (localStorage.getItem('selectedRegion') as 'UK' | 'US') ?? 'UK';
          return region === 'US' ? this.faithWireDetailUS : this.faithWireDetailUK;
      }
}
