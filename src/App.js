import logo from './logo.svg';
import './App.css';
import StudentsPage from './pages/StudentsPage';
import TeacherPage from './pages/TeacherPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/studio" element={<TeacherPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
