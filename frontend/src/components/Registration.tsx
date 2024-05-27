import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { DateField } from "@mui/x-date-pickers";

const Registration = () => {
  const initialValues = {
    username: "",
    password: "",
    name: "",
    surname: "",
    date_of_birth: null,
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

  const handleCreateAccount = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(formValues);

    let formData = new FormData();
    formData.append("username", formValues.username);
    formData.append("password", formValues.password);
    formData.append("name", formValues.name);
    formData.append("surname", formValues.surname);

    console.log(formData);
    // axios
    //   .post("http://localhost:8080/api/storage", formData, {
    //     headers: {
    //       "content-type": "multipart/form-data",
    //     },
    //   })
    //   .then(toast("Successfull upload!"));
  };

  return (
    <div>
      <h1>Registration</h1>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
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
            setFormValues({ ...formValues, date_of_birth: newValue })
          }
        />
        <br></br>

        <Button
          variant="contained"
          color="success"
          onClick={handleCreateAccount}
        >
          Create account
        </Button>
      </Grid>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Registration;
