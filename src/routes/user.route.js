import { Router } from "express";
import { getNumberOfCustomer, getUserData, login, register } from "../controllers/user.controller.js";
import { authorize, authUser } from "../middleware/auth.middleware.js";

const userRoute = Router()

userRoute.post('/register', register)
userRoute.post('/login', login)
userRoute.get('/profile', authUser, getUserData)
userRoute.get('/number', authUser, authorize('select.user'), getNumberOfCustomer)


export default userRoute