import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Muscheduler</h2>
            <nav>
                <ul>
                    <li><Link to="/students">Students</Link></li>
                    <li><Link to="/calendar">Calendar</Link></li>
                    <li><Link to="/studio">My Studio</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;