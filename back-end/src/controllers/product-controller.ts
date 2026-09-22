import type { Request, Response } from "express"
import { ModelModule } from "../modules/model-module.js"
import { ViewModule } from "../modules/view-module.js"
import { DataModule } from "../data/data-module.js"


export class ProductController {

    static async getProducts(req: Request, res: Response) {
      ViewModule.logEvent(" ~ GET products from DB")
      try {
        let productsList: DataModule.ProductData[] | null = await ModelModule.getProductsFromDB()
        
        if (!productsList){
          ViewModule.logError(" ~ ! GET products from DB --")
          return res.status(500).json({error: 'Internal server error.'})
        }
        ViewModule.logEvent(" ~ | GET products from DB ++")
        return res.status(200).json(productsList)
      } catch (error) {
        ViewModule.logError(" ~ ! GET products from DB --")
        return res.status(500).json({error: "Server error"})
      }
      
    }

    static async postCreateProduct(req: Request, res: Response) {
        ViewModule.logEvent(" ~ POST create product on DB")
        try {
            let {name, description, price, image} = req.body

            if (!name || !description || price === undefined) {
            return res.status(400).json({ error: "Name, description, and price are required." });
            }

            if (typeof price !== "number" || price < 0) {
            return res.status(400).json({ error: "Price must be a positive number." });
            }

            await ModelModule.createNewProduct(name, description,
                price, image
            )

            ViewModule.logEvent(" ~ | POST create product on DB ++")
            return res.status(200).json({message: "Product created"})
        } catch (error) {
            console.error("ERROR:", error)
            ViewModule.logError(" ~ ! POST create product on DB --")
            return res.status(500).json({error: "Server error"})
        }
    }

    static async postDeleteProduct(req: Request, res: Response) {
        ViewModule.logEvent(" ~ POST delete product on DB")
        try {
            let {productID} = req.body

            if (await ModelModule.deleteProductOnDB(productID)) {
                ViewModule.logEvent(" ~ | POST delete product on DB ++")
                return res.status(200).json({message: "Product deleted"})
            } else {
                ViewModule.logError(" ~ ! POST delete product on DB --")
                return res.status(500).json({error: "Server error"})
            }

        } catch (error) {
            console.error("ERROR:", error)
            ViewModule.logError(" ~ ! POST delete product on DB --")
            return res.status(500).json({error: "Server error"})
        }
    }

    static async postMakeTransaction(req: Request, res: Response) {
      ViewModule.logEvent(" ~ POST transaction")
      try {
        let {products} = req.body
        await ModelModule.userOrderToDB(products, req.session.userId!)

        ViewModule.logEvent(" ~ | POST transaction ++")
        return res.status(200).json({message: "Transaction successful"})
      } catch (error) {
        console.error("ERROR:", error);
        ViewModule.logError(" ~ ! POST transaction --")
        return res.status(500).json({error: "Server error"})
      }
      
    }

    static async postUpdateProduct(req: Request, res: Response) {
      ViewModule.logEvent(" ~ POST update product call")
      try {
        let {productID, newName, newDescription, newPrice, newImage} = req.body

        if (!productID || !newName || !newDescription || !newPrice || !newImage) {
          return res.status(400).json({error: "Some of the passed parameters are incorrect"})
        }

        if (typeof newPrice !== 'number' || newPrice < 0) {
          return res.status(400).json({error: "Price must be positive"})
        }

        if (newName.length <= 0) {
          return res.status(400).json({error: "Name of product must not be empty"})
        }

        if (newDescription.length <= 0) {
          return res.status(400).json({error: "Description of product must not be empty"})
        }

        let updateForm = new DataModule.ProductUpdateForm(
            productID, newName, newDescription, newPrice, newImage
        )
        await ModelModule.updateProduct(updateForm)
        ViewModule.logEvent(" ~ | POST update product ++")
        return res.status(200).json({message: "Product updated"})
      } catch (error) {
        ViewModule.logError("~ ! POST update product --")
        return res.status(500).json({error: "Server error"})
      }
      
    }
}

