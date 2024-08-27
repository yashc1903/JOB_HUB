import express from "express"
import { loginController, logoutController, registerController, updateProfileController } from "../controllers/usercontroller.js"
import { requireSignIn } from "../middlewares/isAuthenticated.js"

const router= express.Router()

router.post('/register',registerController)
router.post('/login',loginController)
router.put('profile/update',requireSignIn,updateProfileController)
router.get('/logout',logoutController)


export default router