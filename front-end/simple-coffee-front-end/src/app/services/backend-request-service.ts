import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpRequest, HttpResponse } from "@angular/common/http";
import { DataModels } from "../data-models/data-models";
import { of, Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

// This service provides the connection with backend server

@Injectable({
    providedIn: 'root'
})
export class BackendRequestService {
    private backendApiURL: string = "http://localhost:3000/api"
    constructor(private http: HttpClient) {}

    getProducts(): Observable<DataModels.ProductData[]> {
        return this.http.get<any[]>(this.backendApiURL + "/products/get-products").pipe(
            map((rawProducts: any[]) => {
                if (!Array.isArray(rawProducts)) return []

                return rawProducts.map((item) => 
                    new DataModels.ProductData(
                        item._id || "id_error",
                        item.name || 'X-X-X',
                        item.description || '',
                        item.amount || 1,
                        item.price || 0,
                        item.image || ''
                    )
                )
            }),
            catchError(this.handleError)
        )
    }

    deleteProduct(productID: string): Observable<{status: number, message: string}> {
        return this.http.post<any>(this.backendApiURL + "/products/post-delete-product",
            { productID },
            {
                withCredentials: true,
                observe: 'response'
            }
        ).pipe(
            map((response: HttpResponse<any>) => ({
                status: response.status,
                message: response.body?.message || "Product deleted"
            })),
            catchError(this.handleError)
        )
    }

    createProduct(name: string, description: string, price: number, image: string): 
    Observable<{status: number, message: string}> {
        return this.http.post<any>(this.backendApiURL + "/products/post-create-product",
            {name, description, price, image},
            {
                withCredentials: true,
                observe: 'response'
            }
        ).pipe(
            map((response: HttpResponse<any>) => ({
                status: response.status,
                message: response.body?.message || "Product created"
            })),
            catchError(this.handleError)
        )
    }

    updateProduct(productID: string, newName: string, newDescription: string, newPrice: number, newImage: string): 
        Observable<{status: number, message: string}> {
            return this.http.post<any>(this.backendApiURL + "/products/post-update-product",
                { productID, newName, newDescription, newPrice, newImage},
                {
                    withCredentials: true,
                    observe: 'response'
                }
            ).pipe(
                map((response: HttpResponse<any>) => ({
                    status: response.status,
                    message: response.body?.message || "Product updated"
                })),
                catchError(this.handleError)
            )
        }

    makeTransaction(order: DataModels.OrderData): Observable<{status: number, message: string}> {
        return this.http.post<any>(this.backendApiURL + "/products/post-make-transaction",
            order,
            {
                withCredentials: true,
                observe: 'response'
            }
        ).pipe(
            map((response: HttpResponse<any>) => ({
                status: response.status,
                message: response.body?.message || "Transaction made"
            })),
            catchError(this.handleError)
        )
    }

    isAdmin(): Observable<boolean> {
        return this.http.get<{ isAdmin: boolean}>(this.backendApiURL + "/auth/get-is-admin",
            {
                withCredentials: true,
                observe: 'response'
            }
        ).pipe(
            map((response: HttpResponse<{ isAdmin: boolean}>) => response.body?.isAdmin === true),
            catchError(() => of(false))
        )
    }

    authUser(name: string, password: string): Observable<{status: number, message: string}> {
        return this.http.post<any>(this.backendApiURL + "/auth/post-auth-client", 
            { name, password},
            {   
                withCredentials: true,
                observe: 'response'
            },
        ).pipe(
            map((response: HttpResponse<any>) => ({
                status: response.status,
                message: response.body?.message
            })),
            catchError(this.handleError)
        )
    }

    getUserProfile(): Observable<DataModels.UserProfileData> {
        return this.http.get<any>(this.backendApiURL + "/users/get-user-profile", {
            withCredentials: true,
            observe: 'response'
        }).pipe(
            map((response: HttpResponse<any>) => {
            const data = response.body;
            console.log(data.body)

            if (!data) {
                throw new Error("Received empty profile response from server.");
            }

            // Safe mapping for nested orders array
            const mappedOrders: DataModels.OrderData[] = Array.isArray(data.orders)
                ? data.orders.map((order: any) => {
                    const mappedProducts: DataModels.ProductData[] = Array.isArray(order.products)
                    ? order.products.map((p: any) => new DataModels.ProductData(
                        p._id || "id_error",
                        p.name || 'Unnamed Item',
                        p.description || '',
                        p.amount || 1,
                        p.price || 0,
                        p.image || ''
                        ))
                    : [];

                    return new DataModels.OrderData(mappedProducts);
                })
                : [];

            // Construct and return the full profile object
            return new DataModels.UserProfileData(
                data._id || 'id_error',
                data.name || 'Anonymous User',
                data.role || 'user',
                data.orders || mappedOrders
            );
            }),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = "An unknown error occurred";

        if (error.error instanceof ErrorEvent) {
            // Client-side / network error
            errorMessage = `Network error: ${error.error.message}`;
        } else if (error.error?.error) {
            // Explicit Server error object (e.g. { error: "Admin privileges required" })
            errorMessage = error.error.error;
        } else if (error.error?.message) {
            // Explicit Server error message
            errorMessage = error.error.message;
        } else {
            // Backend returned just HTTP code
            errorMessage = `Server returned code ${error.status}`;
        }

        return throwError(() => new Error(errorMessage));
    }
}