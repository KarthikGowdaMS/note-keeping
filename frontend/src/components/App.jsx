import React,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './Footer';
import Home from './Home';
import Login from './Login';
import SignUp from './Signup';
import Header from './Header';
import { AuthProvider } from '../context/logincontext';
import { Alert } from './Alert';


function App() {
  const [alert, setalert] = useState(null);
  function showAlert(message,type) {
    setalert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setalert(null)
    }, 1500);
  }

  return (
    <>
      <Router>
        <AuthProvider>
        <Header />
        <Alert alert={alert} />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login showAlert={showAlert}/>}  />
          <Route exact path="/signup" element={<SignUp showAlert={showAlert}/>} />
        </Routes>
        <Footer />
        </AuthProvider>
      </Router>
    </>
  );
}
export default App;
