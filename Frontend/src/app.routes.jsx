import { createBrowserRouter } from "react-router";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import FaceExpression from "../src/features/Expression/components/FaceExpression";
import Protected from "./features/auth/components/Protected";
import Home from "./features/home/pages/Home";

export const router = createBrowserRouter([
    {
      path: "/",
        element: <Protected><Home/></Protected>
    },
    {
        path: "/register",
        element: <Register />
    },

    {
        path: "/login",
        element: <Login />
    }
])