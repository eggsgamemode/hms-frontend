import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

const HospitalRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactDetails: '',
    adminEmail: '',
    phone: '',
    licenseNumber: '',
    adminPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/hospitals/register', formData);
      setSuccess(true);
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || 'Server error'));
    }

    setLoading(false);
  };

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="success">
            Hospital registered successfully! Use admin email/password to login.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Register Hospital</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Hospital Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            name="address"
            label="Address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <TextField
            name="adminEmail"
            label="Admin Email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.adminEmail}
            onChange={handleChange}
            required
          />
          <TextField
            name="phone"
            label="Phone"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            name="licenseNumber"
            label="License Number"
            fullWidth
            margin="normal"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />
          <TextField
            name="adminPassword"
            label="Admin Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.adminPassword}
            onChange={handleChange}
            required
          />
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Registering...' : 'Register Hospital'}
          </Button>
        </form>
        <Button href="/login" sx={{ mt: 2 }}>Already have account? Login</Button>
      </Box>
    </Container>
  );
};

export default HospitalRegister;