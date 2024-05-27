import React from "react";
import logo from "./logo.svg";
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

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index path="login" element={<Login />} />
              <Route path="registration" element={<Registration />} />
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
