import { Router } from 'express';
import { createPatient, deletePatient, getPatientById, getPatients, updatePatient } from '../controller/PatientController';

const patientRoutes = Router();

patientRoutes.route('/')
  .get(getPatients)
  .post(createPatient);

patientRoutes.route('/:patientId')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

export default patientRoutes;
