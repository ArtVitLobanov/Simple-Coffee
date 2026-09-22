import type { Request, Response } from "express";
import { ViewModule } from "../modules/view-module.js";
import { ModelModule } from "../modules/model-module.js";
import { DataModule } from "../data/data-module.js";

export class UserController {
    static async getUserProfile(req: Request, res: Response) {
          ViewModule.logEvent(" ~ GET user profile")
    
          try {
            let userProfile: DataModule.UserProfileData | null = await ModelModule.getUserProfile(req.session.userId!)
            
            if (!userProfile) {
              ViewModule.logError(" ~ ! GET user profile --")
              return res.status(500).json({error: 'Server error'})
            }
            
            ViewModule.logEvent(" ~ | GET user profile ++")
            res.status(200).json(userProfile)
          } catch (error) {
            ViewModule.logError(" ~ ! Get user profile --")
            return res.status(500).send({error: "Server error"})
          }
              
        }
}