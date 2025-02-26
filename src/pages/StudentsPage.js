import React from 'react';
import StudentTable from '../components/StudentTable';
import Button from '../components/Button';

function StudentsPage() {
    return (
        <div className="students-page">
            <h1>Students</h1>
            <div className="students-table-container">
                <StudentTable />
            </div>
        </div>
    );
}

export default StudentsPage;