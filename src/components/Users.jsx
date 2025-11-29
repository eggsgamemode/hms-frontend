import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';

const Users = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'DOCTOR'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('User created successfully!');
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'DOCTOR' });
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Manage Users</Typography>
      {message && <Alert severity={message.includes('Error') ? 'error' : 'success'}>{message}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField name="firstName" label="First Name" fullWidth margin="normal" value={formData.firstName} onChange={handleChange} required />
        <TextField name="lastName" label="Last Name" fullWidth margin="normal" value={formData.lastName} onChange={handleChange} required />
        <TextField name="email" label="Email" type="email" fullWidth margin="normal" value={formData.email} onChange={handleChange} required />
        <TextField name="password" label="Password" type="password" fullWidth margin="normal" value={formData.password} onChange={handleChange} required />
        <TextField name="role" label="Role" select fullWidth margin="normal" value={formData.role} onChange={handleChange} SelectProps={{ native: true }}>
          <option value="DOCTOR">DOCTOR</option>
          <option value="NURSE">NURSE</option>
          <option value="PHARMACIST">PHARMACIST</option>
        </TextField>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Create User</Button>
      </Box>
    </Container>
  );
};

export default Users;