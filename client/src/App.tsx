import './App.css'
import { Home } from './components/home/home';
import { UsernamePage } from './components/username-page/username-page';
import { GamePage } from './components/game-page/game-page';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

function RequireUsername({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const username = sessionStorage.getItem('username');

  if (!username) {
    return <Navigate to="/username" state={{ from: location }} replace />;
  }

  return children;
}

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/username" element={<UsernamePage />} />
        <Route
          path="/"
          element={
            <RequireUsername>
              <Home />
            </RequireUsername>
          }
        />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App
