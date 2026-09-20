
// Provides data objects for logic
export namespace DataModels {

    export class UserProfileData {
        public name: string
        public role: string
        public orders: Array<OrderData>

        constructor(name: string, role: string, orders: OrderData[]) {
            this.name = name
            this.role = role
            this.orders = orders
        }

        addOrder(order: OrderData){
            this.orders.push(order)
        }
    }

    export class ProductData {
        public name: string
        public description: string
        public amount: number
        public price: number
        public image: string

        constructor(name: string, description: string, amount: number, price: number, image: string) {
            this.name = name
            this.description = description
            this.amount = amount
            this.price = price
            this.image = image
        }
    }

    export class OrderData {
        public products: Array<ProductData>
        public price: number = 0

        constructor(products?: Array<ProductData>) {
            if (products) {
                this.products = products
                this.price = 0
                
                if (products.length > 0) {
                    for (const product of this.products){
                        this.price += product.price * product.amount
                    }
                } 
            } else {
                this.products = []
                this.price = 0
            }
            
        }

        addProduct(product: ProductData) {
            this.products.push(product)
            this.price += product.price * product.amount
        }

    }
 
}