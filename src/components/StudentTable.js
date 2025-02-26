import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'parentName',
    headerName: 'Parent Name',
    width: 150,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 250,
    editable: true,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    width: 150,
    editable: true,
  },
  {
    field: 'lessonLength',
    headerName: 'Lesson Length',
    width: 150,
    editable: true,
  },
  {
    field: 'availability',
    headerName: 'Availability',
    width: 250,
    editable: true,
  }
];

const initialRows = [
  { id: 1, name: 'John Doe', parentName: 'Jane Doe', email: 'john.doe@example.com', phone: '123-456-7890', lessonLength: '30 minutes', availability: 'Monday and Wednesday' },
  { id: 2, name: 'John Doe', parentName: 'Jane Doe', email: 'john.doe@example.com', phone: '123-456-7890', lessonLength: '30 minutes', availability: 'Monday and Wednesday' },
  { id: 3, name: 'John Doe', parentName: 'Jane Doe', email: 'john.doe@example.com', phone: '123-456-7890', lessonLength: '30 minutes', availability: 'Monday and Wednesday' },
  { id: 4, name: 'John Doe', parentName: 'Jane Doe', email: 'john.doe@example.com', phone: '123-456-7890', lessonLength: '30 minutes', availability: 'Monday and Wednesday' },
  { id: 5, name: 'John Doe', parentName: 'Jane Doe', email: 'john.doe@example.com', phone: '123-456-7890', lessonLength: '30 minutes', availability: 'Monday and Wednesday' },
  { id: 6, name: 'John Doe', parentName: 'Jane Doe', email: 'john.doe@example.com', phone: '123-456-7890', lessonLength: '30 minutes', availability: 'Monday and Wednesday' },
  { id: 7, name: 'John Doe', parentName: 'Jane Doe', email: 'john.doe@example.com', phone: '123-456-7890', lessonLength: '30 minutes', availability: 'Monday and Wednesday' },
];

const lessonLengthOptions = ['30 minutes', '45 minutes', '60 minutes'];

function StudentTable() {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    parentName: '',
    email: '',
    phone: '',
    lessonLength: '30 minutes',
    availability: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle opening the modal for adding
  const handleClickOpen = () => {
    setIsEditing(false);
    setOpen(true);
  };

  // Function to handle opening the modal for editing
  const handleEditOpen = () => {
    if (selectedStudents.length === 1) {
      const studentToEdit = rows.find(row => row.id === selectedStudents[0]);
      setNewStudent({
        name: studentToEdit.name,
        parentName: studentToEdit.parentName,
        email: studentToEdit.email,
        phone: studentToEdit.phone,
        lessonLength: studentToEdit.lessonLength,
        availability: studentToEdit.availability
      });
      setIsEditing(true);
      setOpen(true);
    }
  };

  // Function to handle closing the modal
  const handleClose = () => {
    setOpen(false);
    // Reset form data when closing
    setNewStudent({
      name: '',
      parentName: '',
      email: '',
      phone: '',
      lessonLength: '30 minutes',
      availability: ''
    });
    setIsEditing(false);
  };

  // Function to handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  // Function to add or update a student
  const handleAddOrUpdateStudent = () => {
    if (isEditing) {
      // Update existing student
      const updatedRows = rows.map(row => {
        if (row.id === selectedStudents[0]) {
          return {
            ...row,
            ...newStudent
          };
        }
        return row;
      });
      setRows(updatedRows);
      setSelectedStudents([]);
    } else {
      // Create a new student with a unique ID
      const id = Math.max(...rows.map(student => student.id), 0) + 1;
      const studentToAdd = {
        id,
        ...newStudent
      };
      
      // Add the new student to the rows
      setRows([...rows, studentToAdd]);
    }
    
    // Close the modal
    handleClose();
  };
  
  // Function to handle student selection
  const handleSelectionChange = (newSelection) => {
    setSelectedStudents(newSelection);
  };
  
  // Function to open delete confirmation dialog
  const handleOpenDeleteDialog = () => {
    if (selectedStudents.length > 0) {
      setDeleteDialogOpen(true);
    }
  };
  
  // Function to close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  // Function to delete selected students
  const handleDeleteStudents = () => {
    const newRows = rows.filter(row => !selectedStudents.includes(row.id));
    setRows(newRows);
    setSelectedStudents([]);
    setDeleteDialogOpen(false);
  };

  return (
    <Box 
      sx={{ 
        height: 'calc(100vh - 100px)', // Subtracts 100px to account for other UI elements
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={handleClickOpen}
          variant="contained"
        >
          Add Student
        </Button>
        <Button 
          color="info" 
          startIcon={<EditIcon />}
          onClick={handleEditOpen}
          variant="contained"
          disabled={selectedStudents.length !== 1}
        >
          Edit Student
        </Button>
        <Button 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={handleOpenDeleteDialog}
          variant="contained"
          disabled={selectedStudents.length === 0}
        >
          Delete
        </Button>
      </Stack>

      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnResize
          autoHeight={false}
          sx={{ height: '100%' }}
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedStudents}
        />
      </Box>

      {/* Add/Edit Student Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please fill out the student information below.
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Student Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newStudent.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="parentName"
            label="Parent Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newStudent.parentName}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={newStudent.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="phone"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={newStudent.phone}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="lesson-length-label">Lesson Length</InputLabel>
            <Select
              labelId="lesson-length-label"
              name="lessonLength"
              value={newStudent.lessonLength}
              label="Lesson Length"
              onChange={handleInputChange}
            >
              {lessonLengthOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="availability"
            label="Availability"
            type="text"
            fullWidth
            variant="outlined"
            value={newStudent.availability}
            onChange={handleInputChange}
            helperText="Example: Monday and Wednesday, 3-5pm"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleAddOrUpdateStudent}
            variant="contained"
            disabled={!newStudent.name || !newStudent.email}
          >
            {isEditing ? 'Save Changes' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>
          {selectedStudents.length > 1 
            ? "Delete Selected Students" 
            : "Delete Student"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedStudents.length > 1 
              ? `Are you sure you want to delete these ${selectedStudents.length} students?` 
              : "Are you sure you want to delete this student?"}
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteStudents} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentTable;