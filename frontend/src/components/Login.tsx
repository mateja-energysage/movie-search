import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }: any) => {
  const navigate = useNavigate();

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

    let formData = new FormData();
    formData.append("username", formValues.username);
    formData.append("password", formValues.password);

    console.log(formData);
    API.post("/login", formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    }).then((res) => {
      console.log(res.data.access_token);
      toast.success("Successfull login!");
      setToken(res.data.access_token);
      navigate("/upload");
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
    </div>
  );
};

export default Login;
