import { Button, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DateField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registration = () => {
  const initialValues = {
    username: "",
    password: "",
    name: "",
    surname: "",
    date_of_birth: dayjs(),
  };

  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = (
    e: { target: { name: any; value: any } } | null
  ) => {
    const { name, value } = e!.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const isFormValid = () => {
    return (
      formValues.username &&
      formValues.password &&
      formValues.name &&
      formValues.surname &&
      formValues.date_of_birth
    );
  };

  const handleCreateAccount = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(formValues);
    API.post("/registration", formValues).then((res) => {
      console.log(res);
      toast.success("Successfull registration!");
    });
  };

  return (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h3" gutterBottom>
          Registration
        </Typography>
        <TextField
          id="username"
          name="username"
          label="Username"
          variant="outlined"
          onChange={handleInputChange}
          value={formValues.username}
        />
        <br></br>

        <TextField
          id="password"
          name="password"
          label="Password"
          variant="outlined"
          onChange={handleInputChange}
          value={formValues.password}
        />
        <br></br>

        <TextField
          id="name"
          name="name"
          label="Name"
          variant="outlined"
          onChange={handleInputChange}
          value={formValues.name}
        />
        <br></br>

        <TextField
          id="surname"
          name="surname"
          label="Surname"
          variant="outlined"
          onChange={handleInputChange}
          value={formValues.surname}
        />
        <br></br>

        <DateField
          name="date_of_birth"
          label="Date of birth"
          value={formValues.date_of_birth}
          onChange={(newValue) =>
            setFormValues({ ...formValues, date_of_birth: newValue! })
          }
        />
        <br></br>

        <Button
          variant="contained"
          color="success"
          onClick={handleCreateAccount}
          disabled={!isFormValid()}
        >
          Create account
        </Button>
      </Grid>
      <ToastContainer />
    </div>
  );
};

export default Registration;
