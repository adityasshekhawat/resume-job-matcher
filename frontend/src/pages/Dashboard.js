import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadResume, clearResumeError } from '../store/slices/resumeSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const { currentResume, parsedData, loading, error } = useSelector(
    (state) => state.resume
  );

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(uploadResume(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSearchJobs = () => {
    navigate('/job-search');
  };

  const renderParsedData = () => {
    if (!parsedData) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Parsed Resume Data
        </Typography>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Skills
          </Typography>
          <List dense>
            {parsedData.skills.map((skill, index) => (
              <ListItem key={index}>
                <ListItemText primary={skill} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Experience
          </Typography>
          <List dense>
            {parsedData.experience.map((exp, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={exp.company}
                  secondary={`${exp.position} (${exp.period})`}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Education
          </Typography>
          <List dense>
            {parsedData.education.map((edu, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={edu.degree}
                  secondary={`${edu.institution} (${edu.year})`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearResumeError())}>
          {error}
        </Alert>
      )}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileSelect}
            data-testid="file-input"
          />
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadClick}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Upload Resume'
            )}
          </Button>
          {currentResume && (
            <Typography variant="body1" color="text.secondary">
              Current Resume: {currentResume.filename}
            </Typography>
          )}
        </Box>
        {renderParsedData()}
        {currentResume && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchJobs}
              size="large"
            >
              Search for Jobs
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
