import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/Signup';
import MainPage from './components/MainPage';
import Landingpage from './components/Landingpage';
import Clubprofile from './components/Clubprofile';
import Addform from './components/Addform';
import Logout from './components/Logout';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/club/:id" element={<Clubprofile />} />
          <Route path="/addform" element={<Addform />} />
          <Route path="/logout" element={<Logout/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
