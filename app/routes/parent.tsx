import { Outlet } from "@remix-run/react";

export default function Parent() {
    return (
        <div>
            <h1>Parent</h1>
            <nav>
                <ul>
                    <li><a href="/parent">Parent</a></li>
                    <li><a href="/parent/child1">Child 1</a></li>
                    <li><a href="/parent/child2">Child 2</a></li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}