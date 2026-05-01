import express from 'express';
import router from 'express.Router()';
import userController from '../controllers/userController.js';
import appointmentController from '../controllers/appointmentController.js';

router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.post('/appointments', appointmentController.CreateAppointment);
router.get('/appointments', appointmentController.GetAppointments);

export default router;