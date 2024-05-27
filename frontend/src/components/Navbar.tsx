import * as React from "react";
import Box from "@mui/material/Box";
import { Button, Toolbar, AppBar } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  function handleClickUpload() {
    navigate("/upload");
  }

  function handleClickSearch() {
    navigate("/search");
  }

  function handleClickStatistics() {
    navigate("/statistics");
  }

  function handleClickRegistration() {
    navigate("/registration");
  }

  function handleClickLogin() {
    navigate("/login");
  }

  // TODO: put navigation to all routes
  // TODO: When logged in remove registration and login, add logout button
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Button color="inherit" onClick={handleClickUpload}>
              Upload
            </Button>
            <Button color="inherit" onClick={handleClickSearch}>
              Search
            </Button>
            <Button color="inherit" onClick={handleClickStatistics}>
              Statistics
            </Button>
          </Box>
          <Box>
            <Button color="inherit" onClick={handleClickLogin}>
              Login
            </Button>
            <Button color="inherit" onClick={handleClickRegistration}>
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
