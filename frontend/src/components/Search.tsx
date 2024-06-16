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
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";

const Search = () => {
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

  const sortByList = [
    "runtime",
    "vote_count",
    "revenue",
    "vote_average",
    "budget",
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

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const [idValue, setIdValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [resultList, setResultList] = useState<Array<any> | null>(null);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSortByChange = (e: any) => {
    setSortBy(e.target.value);
  };

  const handleGenreChange = (event: { target: { value: any } }) => {
    setFormValues({
      ...formValues,
      genres: event.target.value,
    });
  };

  const setDefaultValuesToNull = (values: any) => {
    const newValues: any = {};
    Object.keys(values).forEach((key) => {
      if (values[key] === "" || values[key].length === 0) {
        newValues[key] = null;
      } else {
        newValues[key] = values[key];
      }
    });
    return newValues;
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);

    const filteredValues = setDefaultValuesToNull(formValues);
    console.log(filteredValues);

    API.post("/movies/search", filteredValues, {
      params: { sort_by: sortBy ? sortBy : null, page: newPage },
    }).then((res: any) => {
      console.log(res);
      setResultList(res.data.results);
      setCount(res.data.total_count);
    });
  };

  const handleSubmit = (e: { preventDefault: () => void } | null) => {
    e!.preventDefault();
    const filteredValues = setDefaultValuesToNull(formValues);
    console.log(filteredValues);

    API.post("/movies/search", filteredValues, {
      params: { sort_by: sortBy ? sortBy : null },
    }).then((res: any) => {
      console.log(res);
      setResultList(res.data.results);
      setCount(res.data.total_count);
      setPage(0);
    });
  };

  const handleDeleteAll = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("DELEETE");
    API.delete("/movies").then((res) => {
      console.log(res);
      toast.success("Successfull deletion of all data!");
      setResultList(null);
    });
  };

  const handleIdSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    API.get(`/movies/${idValue}`).then((res: any) => {
      console.log(res);
      setResultList(res.data ? [res.data] : []);
    });
  };

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
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    name="sort_by"
                    value={sortBy}
                    onChange={handleSortByChange}
                  >
                    {sortByList.map((element) => (
                      <MenuItem key={element} value={element}>
                        {element}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              <Button type="submit" variant="contained">
                Apply Filters
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAll}
              >
                Delete all
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom align="center">
            Get Movie by ID
          </Typography>
          <Box component="form" onSubmit={handleIdSubmit} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Movie ID"
                  name="id"
                  fullWidth
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button type="submit" variant="contained">
                  Get Movie
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {resultList && (
        <Box sx={{ marginTop: 4 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    ID
                  </TableCell>
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
                {resultList.map((row: any) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.id}</TableCell>
                    <TableCell align="right">{row.runtime}</TableCell>
                    <TableCell align="right">{row.vote_average}</TableCell>
                    <TableCell align="right">{row.vote_count}</TableCell>
                    <TableCell align="right">{row.revenue}</TableCell>
                    <TableCell align="right">{row.budget}</TableCell>
                    <TableCell align="right">{row.release_date}</TableCell>
                    <TableCell align="right">{row.overview}</TableCell>
                    <TableCell align="right">
                      {row.genres?.join(", ")}
                    </TableCell>
                    <TableCell align="right">
                      {row.production_companies?.join(", ")}
                    </TableCell>
                    <TableCell align="right">
                      <Checkbox checked={row.is_adult} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
                    count={count}
                    rowsPerPage={resultList.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[]}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
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

export default Search;
