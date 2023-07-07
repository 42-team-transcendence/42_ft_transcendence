import { Outlet } from "react-router-dom";

const Layout = (): JSX.Element => {
    return (
        <main className="App">
            <Outlet />
        </main>
    )
}
export default Layout;