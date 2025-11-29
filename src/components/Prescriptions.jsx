import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Chip } from '@mui/material';

const Prescriptions = () => {
  const { token } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '', medications: [{ name: '', dosage: '' }], instructions: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/prescriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptions(res.data.prescriptions);
    } catch (err) {
      setMessage('Error loading prescriptions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/prescriptions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Prescription created!');
      setFormData({ patientId: '', medications: [{ name: '', dosage: '' }], instructions: '' });
      fetchPrescriptions();
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Prescriptions</Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Create Prescription</Typography>
        {message && <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mt: 1 }}>{message}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField name="patientId" label="Patient ID" value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})} sx={{ mr: 2 }} />
          <TextField name="instructions" label="Instructions" value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} fullWidth sx={{ mb: 2 }} />
          <Button type="submit" variant="contained">Create Prescription</Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>Medications</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>{prescription.id}</TableCell>
                <TableCell>{prescription.patientId}</TableCell>
                <TableCell>
                  {prescription.medications.map((med, i) => (
                    <Chip key={i} label={`${med.name} ${med.dosage}`} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </TableCell>
                <TableCell>{prescription.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default Prescriptions;