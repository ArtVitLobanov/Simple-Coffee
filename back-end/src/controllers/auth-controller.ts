import type { Request, Response } from "express"
import { ViewModule } from "../modules/view-module.js"
import { ModelModule } from "../modules/model-module.js"
import { DataModule } from "../data/data-module.js"

export class AuthController {

    // GET
    static async getIsAdmin(req: Request, res: Response) {
          ViewModule.logEvent(" ~ GET is admin call")
          try{
            ViewModule.logEvent(" ~ | GET is admin call ++")
            if (req.session.userRole == "admin") {
              return res.status(200).json({isAdmin: true})
            } else {
              return res.status(400).json({isAdmin: false})
            }
          }
          catch (error) {
            ViewModule.logError(" ~ ! Get is admin error")
            return res.status(500).send({error: "Server error"})
          }  
        }

    // POST
    static async postAuthClient(req: Request, res: Response) {
        ViewModule.logEvent(" ~ POST client authorization call")
        try {
          let {name, password} = req.body;
          let user: DataModule.UserData | null = await ModelModule.getUserFromDB(name, password)
          
          if (!user || user.password !== password) {
              ViewModule.logError(" ~ ! POST client authorization --")
              return res.status(400).json({error: 'Invalid username/password.'})
          }
          
          ViewModule.logEvent(" ~ | POST client authorization ++")

          req.session.userId = user.id;
          req.session.userName = user.name;
          req.session.userRole = user.role;

          ViewModule.logEvent(" ~ | ~ Session save call")
          req.session.save((err) => {
            if (err) {
                ViewModule.logError(" ~ | ~ ! Session save --")
                return res.status(500).send({error: "Server error"})  
            }

            ViewModule.logEvent(" ~ | ~ | Session save ++")
            return res.status(200).json({message: 'Login successful.'})
        })
        } catch (error) {
            ViewModule.logError("~ ! POST client authorization --")
            return res.status(500).send({error: "Server error"})
        }
        
    }

}