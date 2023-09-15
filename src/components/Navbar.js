import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul className='navList'
                style={{
                textAlign: 'left',
            }}>
                <li>
                    <NavLink to="/tools-1">Default</NavLink>
                </li>
                <li>
                    <NavLink to="/tools-2">3D model</NavLink>
                </li>
                <li>
                    <NavLink to="/tools-3">3D model with second layer Image</NavLink>
                </li>
                <li>
                    <NavLink to="/tools-4">3D model with second layer Gradient image</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
