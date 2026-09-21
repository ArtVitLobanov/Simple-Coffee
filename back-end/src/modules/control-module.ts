import type { Request, Response, NextFunction } from "express";
import { ModelModule } from "./model-module.js";
import { ViewModule } from "./view-module.js";
import { DataModule } from "../data/data-module.js";
import mongoose from "mongoose";

// Change

// Methods are 'grouped'
//  - UTILITY : are needed for services out the program
//  - POST/GET/etc. : according functions
//  - MIDDLEWARE : middleware layers
//  - MAINTENCE : error handling, etc.

// This "Control Module" is the 'central' module, which allows holds other modules

export class ControlModule {
    private model: ModelModule 
    private view: ViewModule
    private DBUrl: string = "mongodb://localhost:27017/SimpleCoffeeDB" 

    constructor() {
        this.model = new ModelModule()
        this.view = new ViewModule()
    }

    async UTILITY_ConnectToDB() {
      mongoose
        .connect(this.DBUrl)
        .then(() => this.view.logEvent("UTILITY database connected"))
        .catch((error) => this.view.logError("UTILITY failed to connect to database"))
    }

    MIDDLEWARE_RequiredAuth(req: Request, res: Response, next: NextFunction) {
      if (req.session.userName && req.session.userId) {
        return next()
      }

      res.status(400).json({error: 'Please, log in first'});
    }

    MIDDLEWARE_AdminRequired(req: Request, res: Response, next: NextFunction) {
      if (req.session.userRole == "admin") {
        return next()
      }

      res.status(400).json({message: 'Admin privilages required'})
    }

    MIDDLEWARE_NotFound(req: Request, res: Response) {
      this.view.logEvent
      res.status(404).json({error: `Not found : ${req.originalUrl}`})
    }

    MIDDLEWARE_ErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
      res.status(res.statusCode !== 200 ? res.statusCode : 500)
      res.json({error: error.message})
    }

    async POST_UpdateProduct(req: Request, res: Response) {
      this.view.logEvent(" ~ POST update product call")
      try {
        let {oldName, newName, newDescription, newPrice, newImage} = req.body

        if (!oldName || !newName || !newDescription || !newPrice || !newImage) {
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
            oldName, newName, newDescription, newPrice, newImage
        )
        await this.model.updateProduct(updateForm)
        this.view.logEvent(" ~ | POST update product ++")
        return res.status(200).json({message: "Product updated"})
      } catch (error) {
        return this.MAINTENCE_GenericServerError(" ~ ! POST update product --", res)
      }
      
    }

    async GET_IsAdmin(req: Request, res: Response) {
      this.view.logEvent(" ~ GET is admin call")
      try{
        this.view.logEvent(" ~ | GET is admin call ++")
        if (req.session.userRole == "admin") {
          return res.status(200).json({isAdmin: true})
        } else {
          return res.status(400).json({isAdmin: false})
        }
      }
      catch (error) {
        return this.MAINTENCE_GenericServerError(" ~ ! Get is admin error", res)
      }  
    }

    async POST_AuthClient(req: Request, res: Response) {
        this.view.logEvent(" ~ POST client authorization call")
        try {
          let {name, password} = req.body;
          let user: DataModule.UserData | null = await this.model.getUserFromDB(name, password)
          
          if (!user || user.password !== password) {
              this.view.logError(" ~ ! POST client authorization --")
              return res.status(400).json({error: 'Invalid username/password.'})
          }
          
          this.view.logEvent(" ~ | POST client authorization ++")

          req.session.userId = user.id;
          req.session.userName = user.name;
          req.session.userRole = user.role;

          this.view.logEvent(" ~ | ~ Session save call")
          req.session.save((err) => {
            if (err) {
              return this.MAINTENCE_GenericServerError(" ~ | ~ ! Session save --", res)
            }

            this.view.logEvent(" ~ | ~ | Session save ++")
            return res.status(200).json({message: 'Login successful.'})
        })
        } catch (error) {
          return this.MAINTENCE_GenericServerError("~ ! POST client authorization --", res)
        }
        
    }

    async POST_MakeTransaction(req: Request, res: Response) {
      this.view.logEvent(" ~ POST transaction")
      try {
        let {products} = req.body
        await this.model.userOrderToDB(products)

        this.view.logEvent(" ~ | POST transaction ++")
        return res.status(200).json({message: "Transaction successful"})
      } catch (error) {
        return this.MAINTENCE_GenericServerError(" ~ ! POST transaction --", res)
      }
      
    }

    async GET_Products(req: Request, res: Response) {
      this.view.logEvent(" ~ GET products from DB")
      try {
        let productsList: DataModule.ProductData[] | null = await this.model.getProductsFromDB()
        
        if (!productsList){
          this.view.logError(" ~ ! GET products from DB --")
          return res.status(500).json({error: 'Internal server error.'})
        }
        this.view.logEvent(" ~ | GET products from DB ++")
        return res.status(200).send(productsList)
      } catch (error) {
        return this.MAINTENCE_GenericServerError(" ~ ! GET products from DB --", res)
      }
      
    }

    GET_UserProfile(req: Request, res: Response) {
      this.view.logEvent(" ~ GET user profile")

      try {
        let userProfile: DataModule.UserProfileData | null = this.model.getUserProfile()
        
        if (!userProfile) {
          this.view.logError(" ~ ! GET user profile --")
          return res.status(500).json({error: 'Server error'})
        }
        
        this.view.logEvent(" ~ | GET user profile ++")
        res.status(200).send(userProfile)
      } catch (error) {
        return this.MAINTENCE_GenericServerError(" ~ ! Get user profile --", res)
      }
          
    }

    MAINTENCE_GenericServerError(logMessage: string, res: Response) {
      this.view.logError(logMessage)
      return res.status(500).send({error: "Server error"})
    }

}
