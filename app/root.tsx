import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { Toaster } from "./components/ui/sonner";
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap",
  },
];

export default function App() {

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#475569" />
        <meta name="apple-mobile-web-app-status-bar" content="#475569" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Financial Calculator" />
        <meta name="apple-mobile-web-app-title" content="Financial Calculator" />
        <meta name="msapplication-TileColor" content="#475569" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <Meta />
        <Links />
      </head>
      <body className="relative font-display bg-slate-100">
        <div className="bg-slate-600 h-[30vh] w-full absolute top-0 left-0 -z-10"></div>
        <Outlet />
        <Toaster position="bottom-center" duration={3000} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
