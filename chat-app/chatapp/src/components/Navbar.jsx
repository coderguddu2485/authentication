import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Navbar() {

    const { user, logout } = useContext(AuthContext);

    return (
        <nav>

            {user && (
                <>
                    <span>Welcome, {user.name}</span>

                    <button onClick={logout}>
                        Logout
                    </button>
                </>
            )}

        </nav>
    );
}

export default Navbar;