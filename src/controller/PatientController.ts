import { Request, Response } from "express";
import { Patient } from "../interface/Patient";
import { connection } from "../config/mysqlFile.config";
import { QUERY } from "../query/PatientsQueries";
import { Code } from "../enum/Code.enum";
import { HttpResponse } from "../domain/Response";
import { Status } from "../enum/Status.enum";
import { FieldPacket, QueryResult, ResultSetHeader } from "mysql2";

// Defining a type alias for the result set returned by MySQL queries.
type ResultSet = [QueryResult, FieldPacket[]];

// Controller function to retrieve all patients.
export const getPatients = async (req: Request, res: Response): Promise<void> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_PATIENTS);
        res.status(Code.OK)
            .send(new HttpResponse(Code.OK, Status.OK, 'Patients retrieved', result[0]));
    } catch (error: unknown) {
        res.status(Code.INTERNAL_SERVER_ERROR)
            .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
    }
};

// Controller function to retrieve a patient by ID.
export const getPatientById = async (req: Request, res: Response): Promise<void> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT_BY_ID, [req.params.patientId]);
        if ((result[0] as Array<ResultSet>).length > 0) {
            res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, 'Patient retrieved', result[0]));
        } else {
            res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient does not exist'));
        }
    } catch (error: unknown) {
        res.status(Code.INTERNAL_SERVER_ERROR)
            .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
    }
};

// Controller function to create a new patient.
export const createPatient = async (req: Request, res: Response): Promise<void> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    let patient: Patient = { ...req.body };
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.INSERT_PATIENT, Object.values(patient));
        patient = { id: (result[0] as ResultSetHeader).insertId, ...req.body };
        res.status(Code.CREATED)
            .send(new HttpResponse(Code.CREATED, Status.CREATED, 'Patient created', patient));
    } catch (error: unknown) {
        res.status(Code.INTERNAL_SERVER_ERROR)
            .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
    }
};

// Controller function to update an existing patient.
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    let patient: Patient = { ...req.body };
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT_BY_ID, [req.params.patientId]);
        if ((result[0] as Array<ResultSet>).length > 0) {
            await pool.query(QUERY.UPDATE_PATIENT, [...Object.values(patient), req.params.patientId]);
            res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, 'Patient updated', { ...patient, id: req.params.patientId }));
        } else {
            res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient does not exist'));
        }
    } catch (error: unknown) {
        res.status(Code.INTERNAL_SERVER_ERROR)
            .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
    }
};

// Controller function to delete a patient.
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT_BY_ID, [req.params.patientId]);
        if ((result[0] as Array<ResultSet>).length > 0) {
            await pool.query(QUERY.DELETE_PATIENT, [req.params.patientId]);
            res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, 'Patient deleted'));
        } else {
            res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Patient does not exist'));
        }
    } catch (error: unknown) {
        res.status(Code.INTERNAL_SERVER_ERROR)
            .send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
    }
};