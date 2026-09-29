import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import LandingPage from "./features/landing/LandingPage.jsx";
import { AuthProvider } from "./features/auth/auth.content.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <AuthProvider><Login /></AuthProvider>,
  },
  {
    path: "/register",
    element: <AuthProvider><Register /></AuthProvider>
  },
]);

export default router;