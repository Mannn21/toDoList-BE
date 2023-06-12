import { PrismaClient } from "@prisma/client";
import response from "../utils/response.js";

const prisma = new PrismaClient()

const getActivities = async (req, res) => {
    try {
        
    } catch (err) {
        if (err.code === "ECONNREFUSED") {
            return response(500, "Connection refused, please try again later", null, "Internal server error", res)
        }
        return response(500, "Database query error", null, "Internal server error", res)
    }
}

const createActivity = async (req, res) => {
    try {
        
    } catch (err) {
        if (err.code === "ECONNREFUSED") {
            return response(500, "Connection refused, please try again later", null, "Internal server error", res)
        }
        return response(500, "Database query error", null, "Internal server error", res)
    }
}

export default {
    getActivities
}