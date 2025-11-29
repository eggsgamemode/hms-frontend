import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Alert 
} from '@mui/material';

const Patients = () => {
  const { token } = useAuth();
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '', phone: '', address: ''
  });
  const [message, setMessage] = useState('');

  // Load patients on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data.patients);
    } catch (err) {
      setMessage('Error loading patients');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/patients', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Patient created!');
      setFormData({ firstName: '', lastName: '', dateOfBirth: '', gender: '', phone: '', address: '' });
      fetchPatients(); // Refresh list
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Patients</Typography>
      
      {/* Create Patient Form */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Add New Patient</Typography>
        {message && <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mt: 1 }}>{message}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} sx={{ mr: 2, width: 150 }} />
          <TextField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} sx={{ mr: 2, width: 150 }} />
          <TextField name="dateOfBirth" label="DOB" type="date" value={formData.dateOfBirth} onChange={handleChange} sx={{ mr: 2, width: 150 }} InputLabelProps={{ shrink: true }} />
          <TextField name="gender" label="Gender" value={formData.gender} onChange={handleChange} sx={{ mr: 2, width: 120 }} />
          <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} sx={{ mr: 2, width: 150 }} />
          <Button type="submit" variant="contained">Add Patient</Button>
        </Box>
      </Box>

      {/* Patients Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Date of Birth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.firstName}</TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.dateOfBirth}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Patients;