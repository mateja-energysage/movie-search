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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const Search = () => {
  // TODO: Update with correct values
  const genresList = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Science Fiction",
    "Thriller",
    "Adventure",
  ];

  const [formValues, setFormValues] = useState({
    q: "",
    runtime_lte: "",
    runtime_gte: "",
    vote_average_lte: "",
    vote_average_gte: "",
    vote_count_lte: "",
    vote_count_gte: "",
    revenue_lte: "",
    revenue_gte: "",
    budget_lte: "",
    budget_gte: "",
    is_adult: false,
    genres: [],
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGenreChange = (event: { target: { value: any } }) => {
    setFormValues({
      ...formValues,
      genres: event.target.value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(formValues);
  };

  const handleDeleteAll = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("DELEETE");
  };

  const [resultList, setResultList] = useState([
    {
      name: "Example Name 1",
      runtime: "Example runtime 1",
      vote_average: 7.8,
      vote_count: 2456,
      revenue: 750000000,
      budget: 250000000,
      release_date: "2022-03-15",
      overview: "This is the overview for Example Name 1.",
      genres: ["Drama", "Thriller"],
      production_companies: ["Company X", "Company Y"],
      is_adult: false,
    },
    {
      name: "Example Name 2",
      runtime: "Example runtime 2",
      vote_average: 6.5,
      vote_count: 1023,
      revenue: 320000000,
      budget: 150000000,
      release_date: "2021-07-22",
      overview: "This is the overview for Example Name 2.",
      genres: ["Comedy", "Romance"],
      production_companies: ["Company A", "Company B"],
      is_adult: false,
    },
    {
      name: "Example Name 3",
      runtime: "Example runtime 3",
      vote_average: 9.2,
      vote_count: 5600,
      revenue: 980000000,
      budget: 300000000,
      release_date: "2023-11-10",
      overview: "This is the overview for Example Name 3.",
      genres: ["Action", "Adventure"],
      production_companies: ["Company C", "Company D"],
      is_adult: true,
    },
    {
      name: "Example Name 4",
      runtime: "Example runtime 4",
      vote_average: 5.4,
      vote_count: 678,
      revenue: 120000000,
      budget: 80000000,
      release_date: "2020-05-05",
      overview: "This is the overview for Example Name 4.",
      genres: ["Horror", "Mystery"],
      production_companies: ["Company E", "Company F"],
      is_adult: true,
    },
  ]);

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom align="center">
            Search
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Search Query"
                  name="q"
                  fullWidth
                  value={formValues.q}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Runtime (≤)"
                  name="runtime_lte"
                  type="number"
                  fullWidth
                  value={formValues.runtime_lte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Runtime (≥)"
                  name="runtime_gte"
                  type="number"
                  fullWidth
                  value={formValues.runtime_gte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vote Average (≤)"
                  name="vote_average_lte"
                  type="number"
                  fullWidth
                  inputProps={{ step: "0.1" }}
                  value={formValues.vote_average_lte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vote Average (≥)"
                  name="vote_average_gte"
                  type="number"
                  fullWidth
                  inputProps={{ step: "0.1" }}
                  value={formValues.vote_average_gte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vote Count (≤)"
                  name="vote_count_lte"
                  type="number"
                  fullWidth
                  value={formValues.vote_count_lte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vote Count (≥)"
                  name="vote_count_gte"
                  type="number"
                  fullWidth
                  value={formValues.vote_count_gte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Revenue (≤)"
                  name="revenue_lte"
                  type="number"
                  fullWidth
                  value={formValues.revenue_lte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Revenue (≥)"
                  name="revenue_gte"
                  type="number"
                  fullWidth
                  value={formValues.revenue_gte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Budget (≤)"
                  name="budget_lte"
                  type="number"
                  fullWidth
                  value={formValues.budget_lte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Budget (≥)"
                  name="budget_gte"
                  type="number"
                  fullWidth
                  value={formValues.budget_gte}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.is_adult}
                      onChange={handleChange}
                      name="is_adult"
                    />
                  }
                  label="R Rated"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteAll}
                >
                  Delete all
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              <Button type="submit" variant="contained">
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 4 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Runtime
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Vote Average
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Vote Count
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Revenue
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Budget
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Release Date
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Overview
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Genres
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Production Companies
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  R Rated
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultList.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.runtime}</TableCell>
                  <TableCell align="right">{row.vote_average}</TableCell>
                  <TableCell align="right">{row.vote_count}</TableCell>
                  <TableCell align="right">{row.revenue}</TableCell>
                  <TableCell align="right">{row.budget}</TableCell>
                  <TableCell align="right">{row.release_date}</TableCell>
                  <TableCell align="right">{row.overview}</TableCell>
                  <TableCell align="right">{row.genres.join(", ")}</TableCell>
                  <TableCell align="right">
                    {row.production_companies.join(", ")}
                  </TableCell>
                  <TableCell align="right">
                    <Checkbox checked={row.is_adult} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Search;
