import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./component/Header";
import Login from "./pages/Login";
import { Signup } from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

export const Context = React.createContext();

function App() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'))

  const getApps = async () => {
    const res = await fetch(`http://localhost:5000/apps/getApps/${user._id}`)
    const resData = await res.json();
    setApps(resData);
  };

  useEffect(() => {
    if(user){
      setLogin(true)
      try {
        getApps();
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
  }, []);

  return (
    <Context.Provider value={[login, setLogin]}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/"
            element={<Dashboard apps={apps} loading={loading} getApps={getApps}/>}
          />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
