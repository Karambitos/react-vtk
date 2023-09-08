import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul className='navList'>
                <li>
                    <NavLink to="/tools-1">Tool-1</NavLink>
                </li>
                <li>
                    <NavLink to="/tools-2">Tool-2</NavLink>
                </li>
                <li>
                    <NavLink to="/tools-3">Tool-3</NavLink>
                </li>
                <li>
                    <NavLink to="/tools-4">Tool-4</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
