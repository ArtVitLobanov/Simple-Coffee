import { DataModule } from "../data/data-module.js"
import { DatabaseSchemas } from "../data/database-schemas.js";
import { DTO } from "../data/dto-module.js";
import mongoose from 'mongoose'

// This "Model Module" holds logic
export class ModelModule {
    private static dto: DTO = new DTO

    static async getUserFromDB(username: string, password: string) : Promise<DataModule.UserData | null> {
        let userDocument = await DatabaseSchemas.User.findOne({
            name: username,
            password: password
        })

        let user = this.dto.userDTO(userDocument)

        if (!user) {
            return null
        } else { 
            return user
        }
    }

    static async createNewProduct(name: string, description: string,
        price: number, image: string
    ) {
        let productDoc = new DatabaseSchemas.Product({
            name: name,
            description: description,
            amount: 1,
            price: price,
            image: image 
        })
        
        await productDoc.save()

    }

    static async deleteProductOnDB(productID: string): Promise<boolean> {
        const deletedDoc = await DatabaseSchemas.Product.findByIdAndDelete(productID)

        return !!deletedDoc
    }

    static async updateProduct(form: DataModule.ProductUpdateForm) {
        await DatabaseSchemas.Product.findByIdAndUpdate( form.productID,
            { 
                name: form.newName,
                description: form.newDescription,
                price: form.newPrice,
                image: form.newImage
            },
            { runValidators: true }
        )
    }

    static async userOrderToDB(products: DataModule.ProductData[], userId: string) : Promise<void> {
        let order: DataModule.OrderData = new DataModule.OrderData(products)
        await DatabaseSchemas.User.findByIdAndUpdate(
            userId,
            { $push: {
                    orders: order
                }
            },
            { runValidators: true }
        )
    }

    static async getUserProfile(userId: string): Promise<DataModule.UserProfileData | null> {
        try {
            const doc = await DatabaseSchemas.UserProfile.findById(userId);

            if (!doc) {
                return null;
            }

            const userProfile = new DataModule.UserProfileData(doc._id.toString(), doc.name, doc.role!);

            if (Array.isArray(doc.orders)) {
                for (let order of doc.orders) {
                    const mappedOrder = this.dto.orderDTO(order);
                    if (mappedOrder) {
                        userProfile.addOrder(mappedOrder);
                    }
                }
            }

            return userProfile;

        } catch (err) {
            console.log("Error in getUserProfile:", err);
            return null;
        }
    }

    static async getProductsFromDB() : Promise<DataModule.ProductData[] | null> {
        let productsList = await DatabaseSchemas.Product.find()
        let products: DataModule.ProductData[] = []

        for (const productData of productsList){
            products.push(this.dto.productDTO(productData)!)
        }

        return products
    }

}