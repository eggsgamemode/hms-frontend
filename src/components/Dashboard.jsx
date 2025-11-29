import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, 
  ListItemIcon, ListItemText, Button, Container, Grid, Card, CardContent,
  CircularProgress, Alert, Paper 
} from '@mui/material';
import { Dashboard as DashboardIcon, People, LocalHospital, Receipt, PersonAdd } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState({ users: 0, patients: 0, prescriptions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch REAL stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, patientsRes, prescriptionsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/patients`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/prescriptions`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setStats({
          users: usersRes.data.users?.length || 0,
          patients: patientsRes.data.patients?.length || 0,
          prescriptions: prescriptionsRes.data.prescriptions?.length || 0
        });
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['HOSPITALADMIN', 'DOCTOR'] },
    { text: 'Manage Users', icon: <People />, path: '/users', roles: ['HOSPITALADMIN'] },
    { text: 'Patients', icon: <LocalHospital />, path: '/patients', roles: ['HOSPITALADMIN', 'DOCTOR'] },
    { text: 'Prescriptions', icon: <Receipt />, path: '/prescriptions', roles: ['HOSPITALADMIN', 'DOCTOR'] }
  ];

  const canAccess = (item) => item.roles.includes(user?.role);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🏥 HMS Dashboard - {user?.role}
          </Typography>
          <Typography mr={2}>{user?.email}</Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: 280, '& .MuiDrawer-paper': { width: 280 } }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto', px: 2 }}>
          <List>
            {menuItems.map((item) => canAccess(item) && (
              <ListItem button key={item.text} component={Link} to={item.path} sx={{ borderRadius: 2, my: 0.5 }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Typography variant="h3" gutterBottom>Dashboard Overview</Typography>
          
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: 140 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 48, color: '#1e88e5' }} />
                  <Typography variant="h3">{stats.users}</Typography>
                  <Typography variant="h6">Hospital Staff</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: 140 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <LocalHospital sx={{ fontSize: 48, color: '#43a047' }} />
                  <Typography variant="h3">{stats.patients}</Typography>
                  <Typography variant="h6">Patients</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: 140 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Receipt sx={{ fontSize: 48, color: '#fb8c00' }} />
                  <Typography variant="h3">{stats.prescriptions}</Typography>
                  <Typography variant="h6">Prescriptions</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: 140 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PersonAdd sx={{ fontSize: 48, color: '#e53935' }} />
                  <Typography variant="h3">0</Typography>
                  <Typography variant="h6">Pending Tasks</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Recent Activity</Typography>
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography>✅ {stats.patients} patients registered this month</Typography>
              <Typography>📝 {stats.prescriptions} prescriptions issued</Typography>
              <Typography>👥 {stats.users} staff members active</Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;