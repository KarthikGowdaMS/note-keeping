import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./Signup";
function App() {
   return( <>
        <Router>
            <Header />
            <Routes>
                <Route exact path ="/" element={
                    <>
                    <h1 className="header">Welcome to Note keeper</h1>
                    <div className="link">
                    <a href="/login" className="auth-link">Login</a>
                    <a href="/signup"className="auth-link" >Signup</a>
                    </div>
                    </>
                }/>
                <Route exact path="/login" element={<Login />}/>
                <Route exact path="/signup" element={<SignUp />}/>
                <Route exact path="/home" element={<Home />} />
            </Routes>
            <Footer />
        </Router>

    </>
   );
}
export default App;