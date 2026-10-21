import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

// Capacitor is native even when a WebView uses a desktop-style user agent.
(window as Window & { isNativeApp?: boolean }).isNativeApp = true;

const container = document.getElementById("root");
if (!container) throw new Error("Master League: contenitore Android mancante");

const router = getRouter();
createRoot(container).render(<RouterProvider router={router} />);