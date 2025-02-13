import React from 'react';
import StudentRow from './StudentRow';

const students = [
    {
      id: 1,
      studentName: 'Dustin',
      parentName: 'Wen',
      parentEmail: 'Dustin.he@gmail.com',
      parentPhone: '614-923-3076',
      lessonTime: '30 mins',
      availability: {
        Monday: '1:00pm-3:00pm',
        Wednesday: '1:00pm-3:00pm',
        Friday: '1:00pm-3:00pm',
      }
    },
    {
      id: 2,
      studentName: 'Dustin',
      parentName: 'Maggie',
      parentEmail: 'Dustin.he@gmail.com',
      parentPhone: '614-923-3076',
      lessonTime: '1 hr',
      availability: {
        Monday: '1:00pm-3:00pm',
        Wednesday: '1:00pm-3:00pm',
        Friday: '1:00pm-3:00pm',
      }
    },
    // Add more dummy students as needed
  ];

function StudentTable() {
    return (
        <div className="table-container">
            <table>
            <thead>
                <tr>
                    <th>StudentName</th>
                    <th>Parent Name</th>
                    <th>Parent Email</th>
                    <th>Parent Phone</th>
                    <th>Lesson Time</th>
                    <th>Availability</th>
                </tr>
            </thead>
            <tbody>
                {students.map(student => <StudentRow key={student.id} student={student} />)}
            </tbody>
        </table>
        </div>
    );
}

export default StudentTable;