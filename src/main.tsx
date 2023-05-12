import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);


const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router}/>
    </ThemeProvider>
  </React.StrictMode>
);
