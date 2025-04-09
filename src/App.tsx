
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Layout from './components/Layout';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import DailyCategories from './pages/DailyCategories';
import ErrorPage from './pages/ErrorPage'; // Fixed import path
import SearchPage from './pages/SearchPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Index /></Layout>,
    errorElement: <ErrorPage />
  },
  {
    path: "/about",
    element: <Layout><About /></Layout>
  },
  {
    path: "/contact",
    element: <Layout><Contact /></Layout>
  },
  {
    path: "/daily",
    element: <Layout><DailyCategories /></Layout>
  },
  {
    path: "/search",
    element: <Layout><SearchPage /></Layout>
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
