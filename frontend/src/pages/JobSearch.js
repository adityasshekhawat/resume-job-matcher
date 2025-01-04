import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  MenuItem,
  Rating,
} from '@mui/material';
import {
  searchJobs,
  clearJobsError,
  updateFilters,
} from '../store/slices/jobsSlice';

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Internship',
];

const JobSearch = () => {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  const { jobs, loading, error, filters } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (currentResume && filters.location) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    if (!currentResume) {
      return;
    }

    dispatch(
      searchJobs({
        resumeId: currentResume.id,
        location: filters.location,
        jobType: filters.jobType,
      })
    );
  };

  const handleFilterChange = (e) => {
    dispatch(updateFilters({ [e.target.name]: e.target.value }));
  };

  const renderJobCard = (job) => (
    <Grid item xs={12} key={job.id}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                {job.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {job.company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.location}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" gutterBottom>
                Match Score
              </Typography>
              <Rating
                value={job.match_score * 5}
                precision={0.5}
                readOnly
                size="small"
              />
            </Box>
          </Box>
          <Typography variant="body2" paragraph>
            {job.description}
          </Typography>
          <Box sx={{ mb: 2 }}>
            {job.requirements.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {job.salary_range}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Job Search
      </Typography>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearJobsError())}>
          {error}
        </Alert>
      )}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="City, State, or Remote"
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              select
              label="Job Type"
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Types</MenuItem>
              {jobTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={loading || !currentResume}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {!currentResume ? (
        <Alert severity="info">
          Please upload your resume in the Dashboard before searching for jobs.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {jobs.map(renderJobCard)}
        </Grid>
      )}
    </Container>
  );
};

export default JobSearch;
