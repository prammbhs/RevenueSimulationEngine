import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar      from './components/Navbar';
import Dashboard   from './pages/Dashboard';
import DealsPage   from './pages/DealsPage';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f1117] transition-colors duration-300">
          <Navbar />
          <main className="flex-1 w-full py-6 sm:py-8 lg:py-10">
            <Routes>
              <Route path="/"      element={<Dashboard />} />
              <Route path="/deals" element={<DealsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}
