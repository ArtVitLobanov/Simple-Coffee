import { DataModule } from "./data-module.js"

// Standart DTO operations
export class DTO {
    userDTO(userData: any) : DataModule.UserData | null {
        if (!userData) {
            return null
    } else {
            const user: DataModule.UserData = new DataModule.UserData(
                userData._id.toString(),
                userData.name,
                userData.password,
                userData.role
            )
            if (userData.orders){
                for (const orderDocument of userData.orders) {
                let productsDocument = orderDocument.products
                let products: DataModule.ProductData[] = []

                for (const productDocument of productsDocument!) {
                    products.push(new DataModule.ProductData(
                        productDocument._id.toString(),
                        productDocument.name,
                        productDocument.description,
                        productDocument.amount,
                        productDocument.price,
                        productDocument.image
                    ))
                }

                let order: DataModule.OrderData = new DataModule.OrderData(products)
                user.addOrder(order)
            }
            }
            return user
    }
    }

    orderDTO(orderData: any) : DataModule.OrderData | null {
        let productsDocument = orderData.products
        let products: DataModule.ProductData[] = []

        for (const productData of productsDocument) {
            products.push(this.productDTO(productData)!)
        }

        return new DataModule.OrderData(products)
    }

    productDTO(productData: any) : DataModule.ProductData | null {
        let product : DataModule.ProductData = new DataModule.ProductData(
            productData._id.toString(),
            productData.name,
            productData.description,
            productData.amount,
            productData.price,
            productData.image
        )

        return product
    }
    
}