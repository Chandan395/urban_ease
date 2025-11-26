import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ServiceList from "./pages/ServiceList";
import ServiceDetail from "./pages/ServiceDetails";
import BookingHistory from "./pages/BookingHistory";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddService from "./pages/AddService";
import EditService from "./pages/EditService";
import ProtectedRoute from "./components/ProtectedRoute";
import ProviderBookings from "./pages/ProviderBookings";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/:id" element={<ServiceDetail />} />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute role="user">
                <BookingHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider"
            element={
              <ProtectedRoute role="provider">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/add-service"
            element={
              <ProtectedRoute role="provider">
                <AddService />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/edit-service/:id"
            element={
              <ProtectedRoute role="provider">
                <EditService />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/bookings"
            element={
              <ProtectedRoute role="provider">
                <ProviderBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
