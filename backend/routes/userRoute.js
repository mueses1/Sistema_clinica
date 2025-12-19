import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, simulatePayment, googleLogin } from '../controllers/userController.js';
// Razorpay imports (commented for future use):
// import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, googleLogin } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/google-login", googleLogin)
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
// Razorpay routes (commented for future use):
// userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
// userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)

// Simulated payment route
userRouter.post("/simulate-payment", authUser, simulatePayment)







export default userRouter;