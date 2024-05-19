import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./styles/root.css";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          <header className="header">
            <button className="burger" onClick={() => setIsOpen(!isOpen)}>
              ☰
            </button>
            <nav className={`nav ${isOpen ? 'open' : ''}`}>
              <ul className="nav-list">
                <li>
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li>
                  <Link to="/foo" className="nav-link">Foo</Link>
                </li>
                <li>
                  <Link to="/about" className="nav-link">About</Link>
                </li>
              </ul>
            </nav>
          </header>
        </div>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
