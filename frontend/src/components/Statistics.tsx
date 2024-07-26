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
import { toast, ToastContainer } from "react-toastify";
import API from "../api";

const Statistics = () => {
  const [statisticType, setStatisticType] = useState("");
  const [statisticsData, setStatisticsData] = useState<any>(null);

  const handleChange = (event: any) => {
    setStatisticType(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    API.get("/movies/extended-stats", {
      params: { extended_stat_type: statisticType },
    })
      .then((res: any) => {
        console.log(res);
        setStatisticsData(res.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error while fetching statistics!");
      });
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  );
};

export default Statistics;
