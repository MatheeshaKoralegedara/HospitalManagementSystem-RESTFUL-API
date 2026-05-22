import { useEffect, useMemo, useState } from 'react';
import {
  createAppointment,
  createDoctor,
  createPatient,
  deleteAppointment,
  deleteDoctor,
  deletePatient,
  getAllAppointments,
  getAllDoctors,
  getAllPatients,
  updateAppointment,
  updateDoctor,
  updatePatient
} from './api';
import { Appointment, AppointmentRequest, AppointmentStatus, Doctor, Patient } from './types';
import './App.css';

const tabs = ['Overview', 'Doctors', 'Patients', 'Appointments'] as const;
type Tab = (typeof tabs)[number];

const emptyDoctor: Doctor = {
  name: '',
  email: '',
  phone: '',
  address: '',
  department: '',
  specialization: '',
  qualification: '',
  yearsOfExperience: 0,
  salary: 0
};

const emptyPatient: Patient = {
  name: '',
  email: '',
  phone: '',
  address: '',
  bloodGroup: '',
  dateOfBirth: '',
  gender: 'Male',
  medicalHistory: ''
};

const emptyAppointment: AppointmentRequest = {
  doctorId: 0,
  patientId: 0,
  appointmentDate: '',
  timeSlot: '',
  status: 'SCHEDULED',
  reason: ''
};

const toAppointmentRequest = (appointment: Appointment): AppointmentRequest => ({
  doctorId: appointment.doctor?.id || 0,
  patientId: appointment.patient?.id || 0,
  appointmentDate: appointment.appointmentDate?.slice(0, 16) || '',
  timeSlot: appointment.timeSlot || '',
  status: appointment.status,
  reason: appointment.reason || ''
});

const getAge = (dateOfBirth?: string) => {
  if (!dateOfBirth) return 'Not set';
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return Number.isFinite(age) ? `${age}` : 'Not set';
};

const formatDateTime = (value?: string) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorForm, setDoctorForm] = useState<Doctor>(emptyDoctor);
  const [patientForm, setPatientForm] = useState<Patient>(emptyPatient);
  const [appointmentForm, setAppointmentForm] = useState<AppointmentRequest>(emptyAppointment);
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const [doctorData, patientData, appointmentData] = await Promise.all([
        getAllDoctors(),
        getAllPatients(),
        getAllAppointments()
      ]);
      setDoctors(doctorData);
      setPatients(patientData);
      setAppointments(appointmentData);
    } catch (err) {
      setError((err as Error).message || 'Failed to load hospital data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredDoctors = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return doctors;
    return doctors.filter((doctor) =>
      [doctor.name, doctor.department, doctor.specialization, doctor.phone]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [doctors, query]);

  const filteredPatients = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter((patient) =>
      [patient.name, patient.gender, patient.phone, patient.bloodGroup]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [patients, query]);

  const filteredAppointments = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return appointments;
    return appointments.filter((appointment) =>
      [
        appointment.doctor?.name,
        appointment.patient?.name,
        appointment.status,
        appointment.reason,
        appointment.appointmentDate
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [appointments, query]);

  const scheduledCount = appointments.filter((appointment) => appointment.status === 'SCHEDULED').length;
  const completedCount = appointments.filter((appointment) => appointment.status === 'COMPLETED').length;

  const runAction = async (action: () => Promise<unknown>, message: string) => {
    setError(null);
    setSuccess(null);

    try {
      await action();
      setSuccess(message);
      await refresh();
    } catch (err) {
      setError((err as Error).message || 'Action failed.');
    }
  };

  const submitDoctor = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = { ...doctorForm, yearsOfExperience: Number(doctorForm.yearsOfExperience), salary: Number(doctorForm.salary) };
    const action = editingDoctorId
      ? () => updateDoctor(editingDoctorId, payload)
      : () => createDoctor(payload);

    runAction(action, editingDoctorId ? 'Doctor updated.' : 'Doctor added.');
    setDoctorForm(emptyDoctor);
    setEditingDoctorId(null);
  };

  const submitPatient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const action = editingPatientId
      ? () => updatePatient(editingPatientId, patientForm)
      : () => createPatient(patientForm);

    runAction(action, editingPatientId ? 'Patient updated.' : 'Patient registered.');
    setPatientForm(emptyPatient);
    setEditingPatientId(null);
  };

  const submitAppointment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const action = editingAppointmentId
      ? () => updateAppointment(editingAppointmentId, appointmentForm)
      : () => createAppointment(appointmentForm);

    runAction(action, editingAppointmentId ? 'Appointment updated.' : 'Appointment scheduled.');
    setAppointmentForm(emptyAppointment);
    setEditingAppointmentId(null);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">CareOps</p>
          <h1>Hospital Management</h1>
        </div>
        <nav aria-label="Primary">
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations Console</p>
            <h2>{activeTab}</h2>
          </div>
          <div className="topbar-actions">
            <input
              aria-label="Search records"
              className="search-input"
              placeholder="Search records"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button className="secondary-button" onClick={refresh} disabled={loading}>
              {loading ? 'Loading' : 'Refresh'}
            </button>
          </div>
        </header>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        {activeTab === 'Overview' && (
          <section className="overview-grid">
            <div className="metric">
              <span>Doctors</span>
              <strong>{doctors.length}</strong>
            </div>
            <div className="metric">
              <span>Patients</span>
              <strong>{patients.length}</strong>
            </div>
            <div className="metric">
              <span>Scheduled</span>
              <strong>{scheduledCount}</strong>
            </div>
            <div className="metric">
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
            <div className="table-panel span-all">
              <div className="panel-heading">
                <h3>Upcoming Appointments</h3>
                <button className="text-button" onClick={() => setActiveTab('Appointments')}>Manage</button>
              </div>
              <AppointmentTable
                appointments={appointments.slice(0, 6)}
                onEdit={(appointment) => {
                  setAppointmentForm(toAppointmentRequest(appointment));
                  setEditingAppointmentId(appointment.id || null);
                  setActiveTab('Appointments');
                }}
                onDelete={(id) => runAction(() => deleteAppointment(id), 'Appointment deleted.')}
              />
            </div>
          </section>
        )}

        {activeTab === 'Doctors' && (
          <section className="content-grid">
            <form className="form-panel" onSubmit={submitDoctor}>
              <h3>{editingDoctorId ? 'Edit Doctor' : 'Add Doctor'}</h3>
              <label>Name<input value={doctorForm.name} onChange={(event) => setDoctorForm({ ...doctorForm, name: event.target.value })} required /></label>
              <label>Department<input value={doctorForm.department} onChange={(event) => setDoctorForm({ ...doctorForm, department: event.target.value })} required /></label>
              <label>Specialization<input value={doctorForm.specialization} onChange={(event) => setDoctorForm({ ...doctorForm, specialization: event.target.value })} required /></label>
              <label>Qualification<input value={doctorForm.qualification} onChange={(event) => setDoctorForm({ ...doctorForm, qualification: event.target.value })} /></label>
              <div className="field-row">
                <label>Experience<input type="number" min="0" value={doctorForm.yearsOfExperience} onChange={(event) => setDoctorForm({ ...doctorForm, yearsOfExperience: Number(event.target.value) })} /></label>
                <label>Salary<input type="number" min="0" value={doctorForm.salary} onChange={(event) => setDoctorForm({ ...doctorForm, salary: Number(event.target.value) })} /></label>
              </div>
              <label>Email<input type="email" value={doctorForm.email} onChange={(event) => setDoctorForm({ ...doctorForm, email: event.target.value })} /></label>
              <label>Phone<input value={doctorForm.phone} onChange={(event) => setDoctorForm({ ...doctorForm, phone: event.target.value })} /></label>
              <label>Address<input value={doctorForm.address} onChange={(event) => setDoctorForm({ ...doctorForm, address: event.target.value })} /></label>
              <FormActions onCancel={() => { setDoctorForm(emptyDoctor); setEditingDoctorId(null); }} editing={Boolean(editingDoctorId)} label="Save Doctor" />
            </form>
            <div className="table-panel">
              <div className="panel-heading"><h3>Doctor Directory</h3><span>{filteredDoctors.length} records</span></div>
              <DoctorTable
                doctors={filteredDoctors}
                onEdit={(doctor) => { setDoctorForm({ ...emptyDoctor, ...doctor }); setEditingDoctorId(doctor.id || null); }}
                onDelete={(id) => runAction(() => deleteDoctor(id), 'Doctor deleted.')}
              />
            </div>
          </section>
        )}

        {activeTab === 'Patients' && (
          <section className="content-grid">
            <form className="form-panel" onSubmit={submitPatient}>
              <h3>{editingPatientId ? 'Edit Patient' : 'Register Patient'}</h3>
              <label>Name<input value={patientForm.name} onChange={(event) => setPatientForm({ ...patientForm, name: event.target.value })} required /></label>
              <div className="field-row">
                <label>Gender<select value={patientForm.gender} onChange={(event) => setPatientForm({ ...patientForm, gender: event.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></label>
                <label>Blood Group<input value={patientForm.bloodGroup} onChange={(event) => setPatientForm({ ...patientForm, bloodGroup: event.target.value })} /></label>
              </div>
              <label>Date of Birth<input type="date" value={patientForm.dateOfBirth} onChange={(event) => setPatientForm({ ...patientForm, dateOfBirth: event.target.value })} /></label>
              <label>Email<input type="email" value={patientForm.email} onChange={(event) => setPatientForm({ ...patientForm, email: event.target.value })} /></label>
              <label>Phone<input value={patientForm.phone} onChange={(event) => setPatientForm({ ...patientForm, phone: event.target.value })} /></label>
              <label>Address<input value={patientForm.address} onChange={(event) => setPatientForm({ ...patientForm, address: event.target.value })} /></label>
              <label>Medical History<textarea value={patientForm.medicalHistory} onChange={(event) => setPatientForm({ ...patientForm, medicalHistory: event.target.value })} /></label>
              <FormActions onCancel={() => { setPatientForm(emptyPatient); setEditingPatientId(null); }} editing={Boolean(editingPatientId)} label="Save Patient" />
            </form>
            <div className="table-panel">
              <div className="panel-heading"><h3>Patient Registry</h3><span>{filteredPatients.length} records</span></div>
              <PatientTable
                patients={filteredPatients}
                onEdit={(patient) => { setPatientForm({ ...emptyPatient, ...patient }); setEditingPatientId(patient.id || null); }}
                onDelete={(id) => runAction(() => deletePatient(id), 'Patient deleted.')}
              />
            </div>
          </section>
        )}

        {activeTab === 'Appointments' && (
          <section className="content-grid">
            <form className="form-panel" onSubmit={submitAppointment}>
              <h3>{editingAppointmentId ? 'Edit Appointment' : 'Schedule Appointment'}</h3>
              <label>Doctor<select value={appointmentForm.doctorId} onChange={(event) => setAppointmentForm({ ...appointmentForm, doctorId: Number(event.target.value) })} required><option value={0}>Select doctor</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialization}</option>)}</select></label>
              <label>Patient<select value={appointmentForm.patientId} onChange={(event) => setAppointmentForm({ ...appointmentForm, patientId: Number(event.target.value) })} required><option value={0}>Select patient</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}</select></label>
              <label>Date and Time<input type="datetime-local" value={appointmentForm.appointmentDate} onChange={(event) => setAppointmentForm({ ...appointmentForm, appointmentDate: event.target.value })} required /></label>
              <div className="field-row">
                <label>Time Slot<input value={appointmentForm.timeSlot} onChange={(event) => setAppointmentForm({ ...appointmentForm, timeSlot: event.target.value })} placeholder="09:00-09:30" /></label>
                <label>Status<select value={appointmentForm.status} onChange={(event) => setAppointmentForm({ ...appointmentForm, status: event.target.value as AppointmentStatus })}><option value="SCHEDULED">Scheduled</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></label>
              </div>
              <label>Reason<textarea value={appointmentForm.reason} onChange={(event) => setAppointmentForm({ ...appointmentForm, reason: event.target.value })} /></label>
              <FormActions onCancel={() => { setAppointmentForm(emptyAppointment); setEditingAppointmentId(null); }} editing={Boolean(editingAppointmentId)} label="Save Appointment" />
            </form>
            <div className="table-panel">
              <div className="panel-heading"><h3>Appointment Schedule</h3><span>{filteredAppointments.length} records</span></div>
              <AppointmentTable
                appointments={filteredAppointments}
                onEdit={(appointment) => { setAppointmentForm(toAppointmentRequest(appointment)); setEditingAppointmentId(appointment.id || null); }}
                onDelete={(id) => runAction(() => deleteAppointment(id), 'Appointment deleted.')}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function FormActions({ editing, label, onCancel }: { editing: boolean; label: string; onCancel: () => void }) {
  return (
    <div className="form-actions">
      <button type="submit">{editing ? 'Update' : label}</button>
      {editing && <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>}
    </div>
  );
}

function DoctorTable({ doctors, onEdit, onDelete }: { doctors: Doctor[]; onEdit: (doctor: Doctor) => void; onDelete: (id: number) => void }) {
  if (doctors.length === 0) return <EmptyState message="No doctors found." />;
  return (
    <div className="table-scroll">
      <table>
        <thead><tr><th>Name</th><th>Department</th><th>Specialization</th><th>Contact</th><th>Actions</th></tr></thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td><strong>{doctor.name}</strong><span>{doctor.qualification || 'No qualification set'}</span></td>
              <td>{doctor.department}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.phone || doctor.email || 'Not set'}</td>
              <td><RowActions onEdit={() => onEdit(doctor)} onDelete={() => doctor.id && onDelete(doctor.id)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PatientTable({ patients, onEdit, onDelete }: { patients: Patient[]; onEdit: (patient: Patient) => void; onDelete: (id: number) => void }) {
  if (patients.length === 0) return <EmptyState message="No patients found." />;
  return (
    <div className="table-scroll">
      <table>
        <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Blood</th><th>Contact</th><th>Actions</th></tr></thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td><strong>{patient.name}</strong><span>{patient.address || 'No address set'}</span></td>
              <td>{getAge(patient.dateOfBirth)}</td>
              <td>{patient.gender}</td>
              <td>{patient.bloodGroup || 'Not set'}</td>
              <td>{patient.phone || patient.email || 'Not set'}</td>
              <td><RowActions onEdit={() => onEdit(patient)} onDelete={() => patient.id && onDelete(patient.id)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AppointmentTable({ appointments, onEdit, onDelete }: { appointments: Appointment[]; onEdit: (appointment: Appointment) => void; onDelete: (id: number) => void }) {
  if (appointments.length === 0) return <EmptyState message="No appointments found." />;
  return (
    <div className="table-scroll">
      <table>
        <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Reason</th><th>Actions</th></tr></thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td><strong>{appointment.patient?.name || 'Unknown'}</strong><span>{appointment.patient?.phone || 'No contact'}</span></td>
              <td>{appointment.doctor?.name || 'Unknown'}</td>
              <td>{formatDateTime(appointment.appointmentDate)}</td>
              <td><span className={`status-pill ${appointment.status.toLowerCase()}`}>{appointment.status}</span></td>
              <td>{appointment.reason || 'Not set'}</td>
              <td><RowActions onEdit={() => onEdit(appointment)} onDelete={() => appointment.id && onDelete(appointment.id)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="row-actions">
      <button className="text-button" type="button" onClick={onEdit}>Edit</button>
      <button className="danger-button" type="button" onClick={onDelete}>Delete</button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="empty-state">{message}</div>;
}

export default App;
