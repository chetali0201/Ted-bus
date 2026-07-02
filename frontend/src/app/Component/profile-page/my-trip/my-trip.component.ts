import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../../service/customer.service';

@Component({
  selector: 'app-my-trip',
  templateUrl: './my-trip.component.html',
  styleUrls: ['./my-trip.component.css']
})
export class MyTripComponent implements OnInit {

  @Input() booking: any;

  selecteditem: 'trips' | 'wallet' | 'profile' = 'trips';
  mytrip: any = null;

  currentcustomer: any;
  currentname: string = '';
  currentemail: string = '';

  constructor(
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {

    // Input value assign after initialization
    this.mytrip = this.booking;

    const loggedInUserJson = sessionStorage.getItem('Loggedinuser');

    if (loggedInUserJson) {
      this.currentcustomer = JSON.parse(loggedInUserJson);
      this.currentname = this.currentcustomer?.name || '';
      this.currentemail = this.currentcustomer?.email || '';
    }
  }

  handlelistitemclick(item: 'trips' | 'wallet' | 'profile'): void {
    this.selecteditem = item;
  }
}