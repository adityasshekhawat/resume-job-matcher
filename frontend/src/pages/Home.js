import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      title: 'Resume Analysis',
      description:
        'Upload your resume and our AI-powered system will analyze your skills and experience.',
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Job Matching',
      description:
        'Get personalized job recommendations based on your skills and preferences.',
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      title: 'Career Opportunities',
      description:
        'Access a wide range of job opportunities from leading companies.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          mb: 12,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Find Your Perfect Job Match
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Upload your resume and let our AI-powered platform find the best job
          opportunities that match your skills and experience.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            navigate(isAuthenticated ? '/dashboard' : '/register')
          }
          sx={{ px: 4, py: 1.5 }}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
