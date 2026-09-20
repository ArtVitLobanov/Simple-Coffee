import { Injectable } from "@angular/core";
import { DataModels } from "../data-models/data-models";

// This service provides the work of Cart component

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private orderInCart: DataModels.OrderData = new DataModels.OrderData()
    constructor() {}

    addProductToOrderInCart(product: DataModels.ProductData) {
      this.orderInCart.addProduct(product)
    }

    getCartOrder() {
      return this.orderInCart
    }

    resetCart() {
      this.orderInCart = new DataModels.OrderData()
    }

    removeProductFromOrderInCart(productToRemove: DataModels.ProductData) {
      // Finding the product to remove
      this.orderInCart.products = this.orderInCart.products.filter(
        (product) => product !== productToRemove
      );

      // Recalculating the price of order in cart
      this.orderInCart.price = this.orderInCart.products.reduce(
        (sum, p) => sum + (p.price * p.amount), 
        0
      );
  }
}