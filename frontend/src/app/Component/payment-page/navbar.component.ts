import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: '../navbar/navbar.component.html',
  styleUrls: ['../navbar/navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isloggedIn: boolean = false;

  ngOnInit(): void {
    this.isloggedIn = !!sessionStorage.getItem('Loggedinuser');
  }

  navigate(route: string): void {
    // no-op placeholder to satisfy template bindings if used
  }

  handlelogout(): void {
    sessionStorage.removeItem('Loggedinuser');
    this.isloggedIn = false;
  }
}

