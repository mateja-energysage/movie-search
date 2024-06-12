import Box from "@mui/material/Box";
import { Button, Toolbar, AppBar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ token, logout }: any) => {
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

  function handleClickLogout() {
    logout();
    navigate("/login");
  }

  if (!token) {
    return (
      <Box sx={{ flexGrow: 1, marginBottom: 10 }}>
        <AppBar position="static">
          <Toolbar>
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

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 10 }}>
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
            <Button color="inherit" onClick={handleClickLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
