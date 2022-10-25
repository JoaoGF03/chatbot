import { Route, Routes } from 'react-router-dom';
import Dash from './pages/Dash';
import Home from './pages/Home';

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/dash' element={<Dash />} />
    </Routes>
  )
}