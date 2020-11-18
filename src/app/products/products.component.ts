import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Subscription } from 'rxjs';

const Get_Currency = gql`
  query GetCurrency {
    currency 
    }
`;
const Get_Products = gql`
query GetProducts {
  products {
    id,
    title,
    image_url,    
   price(currency:USD)
    product_options{
      title,
      prefix,
      suffix,
      options{
        id,
        value
      }
    }  
  }
  }`;
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  private querySubscription: Subscription;
  loading = true;
  currencylist: any[];
  productsQuerySubscription: Subscription;
  products: any[] = [];
  showSideBar = false;
  currencyQuerySubscription: Subscription;
  currencySelected: string = 'USD';
  productsCurrEquiv: any[] = [];
  selectedId: number;
  productCart: any[] = [];

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.getCurrencies();
    this.getProducts();

  }
  getProducts() {
    this.productsQuerySubscription = this.apollo.watchQuery<any>({
      query: Get_Products
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.products = data.products;

      });
  }

  getCurrencies() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: Get_Currency
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.currencylist = data.currency;

      });
  }

  addProductToCart(item) {
    console.log(item);
    this.showSideBar = true;
    this.selectedId = item.id;
    let itemCopy = { ...item, productCount: 0, initialPrice: item.price }
    if (this.productCart.length < 1) {
      itemCopy.productCount++;
      this.productCart.push(itemCopy);
      return;
    }
    if (this.productCart.length > 0) {
      const found = this.productCart.some(el => el.id === this.selectedId);
      if (!found) {
        itemCopy.productCount += 1;
        itemCopy.price = itemCopy.initialPrice * itemCopy.productCount;
        this.productCart.push(itemCopy);
      } else {
        itemCopy.productCount += 1;
        // this.increaseProductCount(itemCopy);
        itemCopy.price = itemCopy.initialPrice * itemCopy.productCount;

      }
    }
  }
  removeAt(i) {
    this.productCart.splice(i, 1)
  }
  increaseProductCount(item) {
    item.productCount += 1;
    item.price = item.initialPrice * item.productCount;
  }
  decreaseProductCount(item) {
    if (item.productCount === 0) {
      this.productCart.splice(item, 1)
      return;
    }
    item.productCount -= 1;
    item.price = item.initialPrice * item.productCount;
    if (item.productCount === 0) {
      this.removeAt(item)
    }
  }
  getCurrencyEquivalent(curr) {
    this.currencySelected = curr;
    this.currencyQuerySubscription = this.apollo.watchQuery<any>({
      query: gql`
    query getCurrencyEquiv ($currency:Currency){
     
      products {
        id,
        title,
        image_url,    
        price(currency:$currency)
        product_options{
          title,
          prefix,
          suffix,
          options{
            id,
            value
          }
        }  
      }
    
    }
  `,
      variables: {
        currency: curr
      }
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        // this.unfilteredProductsCurrEquiv
        this.products = data.products;
        // this.productsCurrEquiv = this.unfilteredProductsCurrEquiv.filter(item=>item.id === this.selectedId);
      });
  }


}
