export const QUERY = {
    SELECT_PATIENTS: 'SELECT * FROM patients',
    SELECT_PATIENT_BY_ID: 'SELECT * FROM patients WHERE id = ?',
    INSERT_PATIENT: 'INSERT INTO patients (first_name, last_name, email, address, diagnosis, phone, status, image_url) VALUES (?, ?, ?, ?, ?, ?,?,?)',
    UPDATE_PATIENT: 'UPDATE patients SET first_name = ?, last_name = ?, email = ?, address = ?, diagnosis = ?, phone = ?, status = ?, image_url = ? WHERE id = ?',
    DELETE_PATIENT: 'DELETE FROM patients WHERE id = ?'
};