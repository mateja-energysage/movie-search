import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const Statistics = () => {
  const [statisticType, setStatisticType] = useState("");
  const [statisticsData, setStatisticsData] = useState<any>(null);

  const handleChange = (event: any) => {
    setStatisticType(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    getStatistics(statisticType);
  };

  const getStatistics = (type: any) => {
    // Replace this with your API call or data fetching logic
    const mockData = {
      count: 20000,
      min: 0.0,
      max: 2923706026.0,
      avg: 33918532.73955,
      sum: 678370654791.0,
      sum_of_squares: 2.8848953718780146e20,
      variance: 1.3274009996186148e16,
      variance_sampling: 1.327467372987264e16,
      std_deviation: 115212889.88731316,
    };
    setStatisticsData(mockData);
  };

  return (
    <Container maxWidth="lg">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>
          Get Statistics
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Statistic Type</InputLabel>
          <Select value={statisticType} onChange={handleChange}>
            <MenuItem value="runtime">Runtime</MenuItem>
            <MenuItem value="budget">Budget</MenuItem>
            <MenuItem value="revenue">Revenue</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" fullWidth>
          Get Statistics
        </Button>
      </Box>
      {statisticsData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Statistics Data
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(statisticsData).map((key) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </Typography>
                    <Typography variant="body1">
                      {statisticsData[key].toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Statistics;
