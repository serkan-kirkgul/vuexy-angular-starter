import { Component, OnInit } from '@angular/core'
import { first } from 'rxjs/operators'
import { HomeService } from './home.service'
import { Reservation } from './home.models';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public contentHeader: Object;
  public lastReservations: Array<Reservation>;
  public optionalReservations: Array<Reservation>;
  public onRequestReservations: Array<Reservation>;
  public confirmedReservations: Array<Reservation>;
  public notConfirmedReservations: Array<Reservation>;

  public basicDPdataDep: NgbDateStruct;
  public basicDPdataRet: NgbDateStruct;
  public basicDPdataIn: NgbDateStruct;
  public basicDPdataOut: NgbDateStruct;
  public isCollapsed5: boolean;
  public disabled: boolean;
  public roomCount: number[];
  public childCount: number[][];
  
  constructor(private _homeService: HomeService) {
    this.lastReservations = Array<Reservation>();
    this.isCollapsed5 = true;
    this.disabled = true;
    this.roomCount = [1];
    this.childCount = [[],[],[],[]];
  }

  childCountChanged(event, room: number) {
    this.childCount[room] = [];
    if (event.target.value > 0) {
      for (let i = 0; i < event.target.value; i++) {
        this.childCount[room].push(i+1);
      }
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    var $this = this;
    this._homeService.getLastReservations().pipe(first()).subscribe(r => {
      $this.lastReservations = r.reservations;
      $this.optionalReservations = $this.lastReservations.filter((r: any) => { return r.reservableInfo != null && r.reservableInfo.reservable == true });
      $this.onRequestReservations = $this.lastReservations.filter((r: any) => { return (r.reservableInfo == null || r.reservableInfo.reservable == false) && r.confirmationStatus == 0 });
      $this.confirmedReservations = $this.lastReservations.filter((r: any) => { return (r.reservableInfo == null || r.reservableInfo.reservable == false) && r.confirmationStatus == 1 });
      $this.notConfirmedReservations = $this.lastReservations.filter((r: any) => { return (r.reservableInfo == null || r.reservableInfo.reservable == false) && r.confirmationStatus == 2 });
    });
    this.contentHeader = {
      headerTitle: 'Home',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Sample',
            isLink: false
          }
        ]
      }
    }
  }
}
