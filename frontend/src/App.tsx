import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Upload from "./components/Upload";
import Search from "./components/Search";
import Statistics from "./components/Statistics";
import NotFound from "./components/NotFound";
import Registration from "./components/Registration";
import Login from "./components/Login";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useAuth from "./useAuth";

function App() {
  const { token, setToken, logout } = useAuth();

  if (!token) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<Layout token={token} logout={logout} />}
              >
                <Route
                  index
                  path="login"
                  element={<Login setToken={setToken} />}
                />
                <Route path="registration" element={<Registration />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout token={token} logout={logout} />}>
              <Route path="upload" element={<Upload />} />
              <Route path="search" element={<Search />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </LocalizationProvider>
  );
}

export default App;
