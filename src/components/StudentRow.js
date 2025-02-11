import React from 'react';

function StudentRow({ student }) {
    return (
        <tr>
            <td>{student.studentName}</td>
            <td>{student.parentName}</td>
            <td>{student.parentEmail}</td>
            <td>{student.parentPhone}</td>
            <td>{student.lessonTime}</td>
            <td>
                {Object.entries(student.availability).map(([day, time]) => (<div key={day}>{`${day}: ${time}`}</div>))}
            </td>
        </tr>
    );
}

export default StudentRow;