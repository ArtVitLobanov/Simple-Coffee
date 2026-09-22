import { Injectable, signal } from "@angular/core";
import { DataModels } from "../data-models/data-models";
import { Data } from "@angular/router";
import { BackendRequestService } from "./backend-request-service";
import { AuthService } from "./auth-service";

// This service provides the work of Cart component

@Injectable({
    providedIn: 'root'
})
export class CartService {
    orderInCart = signal<DataModels.OrderData>(new DataModels.OrderData())
    errorMessage = signal<string>('')

    constructor(
        public backendService: BackendRequestService,
        public authService: AuthService
    ) {}

    addProductToOrderInCart(product: DataModels.ProductData) {
      this.orderInCart().addProduct(product)
    }

    getCartOrder() {
      return this.orderInCart
    }

    resetCart() {
      this.orderInCart.set(new DataModels.OrderData())
    }

    makeTransaction():void {
        this.backendService.makeTransaction(this.orderInCart()).subscribe({
            next: (res) => {
                this.resetCart()
            },
            error: (err) => {
                if (this.authService.isAdmin()) {
                    this.errorMessage.set('Transaction failed ' + err.message )
                } else {
                    this.errorMessage.set('Transaction failed')
                }
            }
            });
    }

    removeProductFromOrderInCart(productToRemove: DataModels.ProductData) {
      // Finding the product to remove
      this.orderInCart().products = this.orderInCart().products.filter(
        (product) => product !== productToRemove
      );

      // Recalculating the price of order in cart
      this.orderInCart().price = this.orderInCart().products.reduce(
        (sum, p) => sum + (p.price * p.amount), 
        0
      );
  }
}