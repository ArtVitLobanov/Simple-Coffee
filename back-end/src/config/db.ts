import mongoose from "mongoose";
import { ViewModule } from "../modules/view-module.js";

export function connectToDB() {
      mongoose
        .connect("mongodb://localhost:27017/SimpleCoffeeDB" )
        .then(() => ViewModule.logEvent("UTILITY database connected"))
        .catch((error) => ViewModule.logError("UTILITY failed to connect to database"))
    }