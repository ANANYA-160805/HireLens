import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import LandingPage from "./features/landing/LandingPage.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/Interview.jsx";
import { AuthProvider } from "./features/auth/auth.content.jsx";
import Protected from "./features/auth/components/Protected.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: <AuthProvider><Protected><Home /></Protected></AuthProvider>,
  },
  {
    path: "/login",
    element: <AuthProvider><Login /></AuthProvider>,
  },
  {
    path: "/register",
    element: <AuthProvider><Register /></AuthProvider>
  },
  {
    path: "/interview/:InterviewId",
    element: <AuthProvider><Protected><Interview /></Protected></AuthProvider>,
  }
]);

export default router;