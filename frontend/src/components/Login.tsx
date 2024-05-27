import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

const Login = () => {
  const initialValues = {
    username: "",
    password: "",
  };

  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleLogin = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(formValues);

    let formData = new FormData();
    formData.append("username", formValues.username);
    formData.append("password", formValues.password);

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
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h3" gutterBottom>
          Login
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

        <Button variant="contained" color="success" onClick={handleLogin}>
          Login
        </Button>
      </Grid>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Login;
