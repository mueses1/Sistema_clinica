import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary'
import razorpay from 'razorpay';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Detalles Faltantes' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Por favor ingresa un correo electronico valido" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Por favor ingresa una contrasena fuerte" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const user = await userModel.create(userData)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ where: { email } })

        if (!user) {
            return res.json({ success: false, message: "Usuario no encontrado" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Credenciales invalidas" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findByPk(userId, {
            attributes: { exclude: ['password'] }
        })

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Datos Faltantes" })
        }

        const user = await userModel.findByPk(userId)

        await user.update({ name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await user.update({ image: imageURL })
        }

        res.json({ success: true, message: 'Perfil Actualizado' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findByPk(docId, {
            attributes: { exclude: ['password'] }
        })

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor No Disponible' })
        }

        let slots_booked = docData.slots_booked

        // Ensure slots_booked is an object, not a string
        if (typeof slots_booked === 'string') {
            try {
                slots_booked = JSON.parse(slots_booked)
            } catch (e) {
                slots_booked = {}
            }
        }

        // Ensure slots_booked is at least an empty object
        if (!slots_booked || typeof slots_booked !== 'object') {
            slots_booked = {}
        }

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot No Disponible' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findByPk(userId, {
            attributes: { exclude: ['password'] }
        })

        // Important: Remove slots_booked from docData to avoid circular or heavy JSON if cloned
        const docDataForAppointment = docData.toJSON()
        delete docDataForAppointment.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData: userData.toJSON(),
            docData: docDataForAppointment,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        await appointmentModel.create(appointmentData)

        // save new slots data in doctor model
        await docData.update({ slots_booked })

        res.json({ success: true, message: 'Cita Agendada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findByPk(appointmentId)

        // verify appointment user 
        if (Number(appointmentData.userId) !== Number(userId)) {
            return res.json({ success: false, message: 'Acción no autorizada' })
        }

        await appointmentData.update({ cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findByPk(docId)

        let slots_booked = doctorData.slots_booked

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
            await doctorData.update({ slots_booked })
        }

        res.json({ success: true, message: 'Cita Cancelada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.findAll({
            where: { userId }
        })

        // Parse JSON fields if they come as strings from MySQL
        const parsedAppointments = appointments.map(appointment => {
            const apt = appointment.toJSON()

            // Parse docData if it's a string
            if (typeof apt.docData === 'string') {
                try {
                    apt.docData = JSON.parse(apt.docData)
                } catch (e) {
                    console.error('Error al analizar docData:', e)
                }
            }

            // Parse userData if it's a string
            if (typeof apt.userData === 'string') {
                try {
                    apt.userData = JSON.parse(apt.userData)
                } catch (e) {
                    console.error('Error al analizar userData:', e)
                }
            }

            return apt
        })

        res.json({ success: true, appointments: parsedAppointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

/* ============================================
 * RAZORPAY PAYMENT INTEGRATION (COMMENTED FOR FUTURE USE)
 * ============================================
 * Uncomment this section when ready to implement real payment processing
 */
// const razorpayInstance = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
//     ? new razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_KEY_SECRET
//     })
//     : null;

// // API to make payment of appointment using razorpay
// const paymentRazorpay = async (req, res) => {
//     try {
//         const { appointmentId } = req.body
//         const appointmentData = await appointmentModel.findByPk(appointmentId)

//         if (!appointmentData || appointmentData.cancelled) {
//             return res.json({ success: false, message: 'Appointment Cancelled or not found' })
//         }

//         if (!razorpayInstance) {
//             return res.json({ success: false, message: 'Razorpay keys are missing in .env' })
//         }

//         // creating options for razorpay payment
//         const options = {
//             amount: appointmentData.amount * 100,
//             currency: process.env.CURRENCY,
//             receipt: appointmentId.toString(),
//         }

//         // creation of an order
//         const order = await razorpayInstance.orders.create(options)
//         res.json({ success: true, order })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// // API to verify payment of razorpay
// const verifyRazorpay = async (req, res) => {
//     try {
//         const { razorpay_order_id } = req.body

//         if (!razorpayInstance) {
//             return res.json({ success: false, message: 'Razorpay keys are missing in .env' })
//         }

//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

//         if (orderInfo.status === 'paid') {
//             const appointment = await appointmentModel.findByPk(orderInfo.receipt)
//             if (appointment) {
//                 await appointment.update({ payment: true })
//             }
//             res.json({ success: true, message: "Payment Successful" })
//         }
//         else {
//             res.json({ success: false, message: 'Payment Failed' })
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }
/* ============================================ */

// API to simulate payment (for development/testing)
const simulatePayment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findByPk(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: 'Cita no encontrada' })
        }

        if (appointmentData.cancelled) {
            return res.json({ success: false, message: 'La cita ha sido cancelada' })
        }

        if (appointmentData.payment) {
            return res.json({ success: false, message: 'La cita ya ha sido pagada' })
        }

        // Mark appointment as paid
        await appointmentData.update({ payment: true })

        res.json({ success: true, message: 'Pago realizado exitosamente' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for Google Login
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await userModel.findOne({ where: { email } });

        if (!user) {
            // Generate a random password for Google-only users
            const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
            user = await userModel.create({
                name,
                email,
                password: hashedPassword,
                image: picture
            });
        }

        console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
        const appToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret_for_debug');
        res.json({ success: true, token: appToken });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, simulatePayment, googleLogin }
// Razorpay exports (commented for future use):
// export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, googleLogin }
