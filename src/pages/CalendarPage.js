import React from 'react';
import TeacherCalendar from '../components/TeacherCalendar';

function CalendarPage() {
    return (
        <div className="calendar-page">
            <h1>Calendar</h1>
            <div className="calendar-container">
                <TeacherCalendar />
            </div>
        </div>
    );
}

export default CalendarPage;