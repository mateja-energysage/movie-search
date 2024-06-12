import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DateField } from "@mui/x-date-pickers";
import { useState } from "react";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";

const genresList = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
]; // Example genres
const productionCompaniesList = [
  "Warner Bros.",
  "Paramount Pictures",
  "Universal Pictures",
  "20th Century Fox",
  "Sony Pictures",
]; // Example production companies
const Upload = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    runtime: "",
    vote_average: "",
    vote_count: "",
    revenue: "",
    budget: "",
    release_date: null,
    adult: false,
    overview: "",
    genres: [],
    production_companies: [],
  });

  const [bulkValue, setBulkValue] = useState("");

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGenreChange = (event: any) => {
    setFormValues({
      ...formValues,
      genres: event.target.value,
    });
  };

  const handleDateChange = (date: any) => {
    setFormValues({
      ...formValues,
      release_date: date,
    });
  };

  const handleBulkChange = (e: any) => {
    setBulkValue(e.target.value);
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formValues);
  };

  const handleBulkSubmit = (e: any) => {
    e.preventDefault();
    console.log(bulkValue);
    API.post("/movies/bulk", { params: { chunks: bulkValue } }).then((res) => {
      console.log(res);
      toast.success("Successfull bulk upload!");
    });
  };

  const handleProductionCompaniesChange = (event: any) => {
    setFormValues({
      ...formValues,
      production_companies: event.target.value,
    });
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Movie Details
            </Typography>
            <Box component="form" onSubmit={handleFormSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    value={formValues.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Runtime"
                    name="runtime"
                    type="number"
                    fullWidth
                    value={formValues.runtime}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Vote Average"
                    name="vote_average"
                    type="number"
                    fullWidth
                    inputProps={{ step: "0.1" }}
                    value={formValues.vote_average}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Vote Count"
                    name="vote_count"
                    type="number"
                    fullWidth
                    value={formValues.vote_count}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Revenue"
                    name="revenue"
                    type="number"
                    fullWidth
                    value={formValues.revenue}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Budget"
                    name="budget"
                    type="number"
                    fullWidth
                    value={formValues.budget}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateField
                    name="release_date"
                    label="Release date"
                    value={formValues.release_date}
                    onChange={handleDateChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Overview"
                    name="overview"
                    fullWidth
                    multiline
                    rows={4}
                    value={formValues.overview}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Genres</InputLabel>
                    <Select
                      name="genres"
                      multiple
                      value={formValues.genres}
                      onChange={handleGenreChange}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {genresList.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Production Companies</InputLabel>
                    <Select
                      name="production_companies"
                      multiple
                      value={formValues.production_companies}
                      onChange={handleProductionCompaniesChange}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {productionCompaniesList.map((company) => (
                        <MenuItem key={company} value={company}>
                          {company}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formValues.adult}
                        onChange={handleChange}
                        name="adult"
                      />
                    }
                    label="Adult"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" fullWidth>
                    Upload
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              Bulk Upload
            </Typography>
            <Box component="form" onSubmit={handleBulkSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Number of Entries"
                    name="bulk"
                    type="number"
                    fullWidth
                    value={bulkValue}
                    onChange={handleBulkChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" fullWidth>
                    Upload Bulk
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
};

export default Upload;
