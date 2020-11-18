import { Component } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'lumin-men-test';
  rates: any;
  loading = true;
  error: any;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
  //   this.apollo
  //     .watchQuery({
  //       query: gql`
  //         {
  //           rates(currency: "USD") {
  //             currency
  //             rate
  //           }
  //         }
  //       `,
  //     })
  //     .valueChanges.subscribe(result => {
  //       this.rates = result.data
  //       this.loading = result.loading;
  //       this.error = result.error;
  //     });
   }

}
