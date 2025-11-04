import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import './App.css'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/Auth/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import Navbar from './components/Layout/Navbar';
import Users from './pages/Users/UserPage.jsx';
import UserFormPage from './pages/Users/UserFormPage.jsx';
import UserListPage from './pages/Users/UserListPage.jsx';
import MenuFormPage from './pages/Menu/MenuFormPage.jsx';
import MenuListPage from './pages/Menu/MenuListPage.jsx';
import MenuPage from './pages/Menu/MenuPage.jsx';
import TablePage from './pages/Table/TablePage.jsx';
import OrderPage from './pages/Order/OrderPage.jsx';
import TableListPage from './pages/Table/TableListPage.jsx';
import ReserveTablePage from './pages/Table/ReserveTablePage.jsx';
import ReservationsPage from './pages/Table/ReservationsPage.jsx';
import OrderListPage from './pages/Order/OrderListPage.jsx';
import OrderFormPage from './pages/Order/OrderFormPage.jsx';
import OrderTypePage from './pages/Order/OrderTypePage.jsx';
import OptionsPage from './pages/Dashboard/OptionsPage.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position='top-right' />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-zinc-950">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/options" element={<OptionsPage />} />
                    <Route path='/tables' element={<TablePage />} />
                    <Route path='/tables/reserve' element={<ReserveTablePage />} />
                    <Route path='/tables/reservations' element={<ReservationsPage />} />
                    <Route path='/tables/list' element={<TableListPage />} />
                    <Route path='/orders' element={<OrderPage />} />
                    <Route path='/orders/add' element={<OrderTypePage />} />
                    <Route path='/orders/add/:typeId' element={<OrderFormPage />} />
                    <Route path='/orders/list' element={<OrderListPage />} />
                    <Route path='/menu' element={<MenuPage />} />
                    <Route path='/menu/add' element={<MenuFormPage />} />
                    <Route path='/menu/list' element={<MenuListPage />} />
                    <Route path='/users' element={<Users />} />
                    <Route path='/users/add' element={<UserFormPage />} />
                    <Route path='/users/list' element={<UserListPage />} />
                    <Route path='/reports' element={<h1>Reports</h1>} />
                    <Route path='/settings' element={<h1>Settings</h1>} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
