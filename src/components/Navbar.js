import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/tools-1">Tool-1</Link>
                </li>
                <li>
                    <Link to="/tools-2">Tool-2</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
