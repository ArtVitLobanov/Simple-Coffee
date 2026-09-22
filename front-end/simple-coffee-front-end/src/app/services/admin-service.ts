import { Injectable } from "@angular/core";
import { AuthService } from "./auth-service";
import { ProductsService } from "./products-service";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    constructor(
        public authService: AuthService,
        public productsService: ProductsService
    ) {}
}