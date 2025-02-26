import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  Grid, 
  Fab, 
  Menu, 
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add as AddIcon, 
  MoreVert as MoreVertIcon, 
  DeleteOutline as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

// Constants for precise sizing
const CELL_HEIGHT = 60;
const BORDER_WIDTH = 1;
const MINUTES_PER_CELL = 60;
const MINUTES_INTERVAL = 15;
const INTERVALS_PER_CELL = MINUTES_PER_CELL / MINUTES_INTERVAL; // 4 intervals of 15 minutes each

// Styled components
const CalendarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.default,
  position: 'relative' // Important for absolute positioning context
}));

const TimeColumn = styled(Box)(({ theme }) => ({
  width: 60,
  borderRight: `${BORDER_WIDTH}px solid ${theme.palette.divider}`,
  flexShrink: 0,
  zIndex: 1
}));

const TimeSlot = styled(Box)(({ theme }) => ({
  height: CELL_HEIGHT,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  paddingRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  transform: 'translateY(-7px)'
}));

const DayHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  borderLeft: `${BORDER_WIDTH}px solid ${theme.palette.divider}`,
  minWidth: 0
}));

// Visual-only grid cell (for borders and background only)
const DayCell = styled(Box)(({ theme }) => ({
  height: CELL_HEIGHT,
  boxSizing: 'border-box', // include border in the height
  borderBottom: `${BORDER_WIDTH}px solid ${theme.palette.divider}`,
  borderLeft: `${BORDER_WIDTH}px solid ${theme.palette.divider}`
}));

// EventItem with dynamic height based on duration and cursor style for dragging
const EventItem = styled(Paper)(({ theme, bgcolor, isDragging, heightInPx }) => ({
  position: 'absolute',
  width: 'calc(100% - 2px)',
  height: heightInPx || (CELL_HEIGHT - 2),
  margin: '1px',
  backgroundColor: bgcolor || theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: 4,
  padding: theme.spacing(0.5, 1),
  overflow: 'hidden',
  zIndex: isDragging ? 100 : 10,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  cursor: 'move',
  transition: isDragging ? 'none' : 'box-shadow 0.2s ease-in-out',
  boxShadow: isDragging ? theme.shadows[8] : theme.shadows[1]
}));

// Helper functions for time conversion
const timeToMinutes = (timeStr) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + (minutes || 0);
};

const minutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'pm' : 'am';
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }
  return `${hours}:${minutes === 0 ? '00' : minutes} ${period}`;
};

const TeacherCalendar = () => {
  // Sample events data with various durations
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: 'My Lesson', 
      startTime: '11:00 am', 
      endTime: '12:00 pm', 
      day: 'THU',
      color: '#4285F4'
    },
    { 
      id: 2, 
      title: 'My Lesson', 
      startTime: '1:00 pm', 
      endTime: '2:00 pm', 
      day: 'TUE',
      color: '#4285F4'
    },
    { 
      id: 3, 
      title: 'My Lesson', 
      startTime: '5:00 pm', 
      endTime: '6:00 pm', 
      day: 'WED',
      color: '#4285F4'
    },
    { 
      id: 4, 
      title: '30min Lesson', 
      startTime: '3:00 pm', 
      endTime: '3:30 pm', 
      day: 'MON',
      color: '#34A853'
    },
    { 
      id: 5, 
      title: '2hr Workshop', 
      startTime: '4:00 pm', 
      endTime: '6:00 pm', 
      day: 'FRI',
      color: '#EA4335'
    }
  ]);

  // State for tracking drag offset (the position within the event where the user clicked)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // Use a ref for the currently dragged event to avoid stale state issues
  const draggingEventRef = useRef(null);
  const calendarRef = useRef(null);

  // State for managing the menu and edit modal
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: null,
    title: '',
    startTime: '',
    endTime: '',
    day: ''
  });

  // Days of the week for weekly schedule
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Time slots for the calendar
  const timeSlots = [
    '10:00 am', '11:00 am', '12:00 pm', '1:00 pm', '2:00 pm',
    '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm', '7:00 pm', '8:00 pm'
  ];

  // The start time of the calendar in minutes (10:00 am)
  const calendarStartTimeMinutes = timeToMinutes(timeSlots[0]);

  // Map day name to column index and vice versa
  const dayToIndex = {
    'SUN': 0,
    'MON': 1,
    'TUE': 2,
    'WED': 3,
    'THU': 4,
    'FRI': 5,
    'SAT': 6
  };

  const indexToDay = Object.fromEntries(
    Object.entries(dayToIndex).map(([day, index]) => [index, day])
  );

  // Handle menu open
  const handleMenuOpen = (event, eventId) => {
    event.stopPropagation(); // Prevent drag when clicking menu
    setMenuAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEventId(null);
  };

  // Handle delete event
  const handleDeleteEvent = () => {
    setEvents(prevEvents => prevEvents.filter(evt => evt.id !== selectedEventId));
    handleMenuClose();
  };
  
  // Handle edit event (open modal with event data)
  const handleEditEvent = () => {
    const eventToEdit = events.find(evt => evt.id === selectedEventId);
    if (eventToEdit) {
      setEditFormData({
        id: eventToEdit.id,
        title: eventToEdit.title,
        startTime: eventToEdit.startTime,
        endTime: eventToEdit.endTime,
        day: eventToEdit.day,
        color: eventToEdit.color
      });
      setEditModalOpen(true);
    }
    handleMenuClose();
  };
  
  // Handle modal close
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };
  
  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Update the event in the state
    setEvents(prevEvents =>
      prevEvents.map(evt =>
        evt.id === editFormData.id
          ? { ...editFormData }
          : evt
      )
    );
    
    // Close the modal
    setEditModalOpen(false);
  };

  // Handle drag start using a ref for the dragging event
  const handleDragStart = (eventData, e) => {
    // Don't start dragging if we're clicking the menu button
    if (e.target.closest('button')) {
      return;
    }
    
    e.preventDefault();
    const eventElement = e.currentTarget;
    const rect = eventElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    draggingEventRef.current = eventData;
    setDragOffset({ x: offsetX, y: offsetY });

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // Handle drag move: update event's day and time
  const handleDragMove = (e) => {
    if (!draggingEventRef.current || !calendarRef.current) return;

    const calendarRect = calendarRef.current.getBoundingClientRect();
    const timeColumnWidth = 60; // Fixed width for time column

    // Calculate the x and y position relative to the calendar grid
    const x = e.clientX - calendarRect.left - timeColumnWidth - dragOffset.x;
    const y = e.clientY - calendarRect.top - dragOffset.y;

    // Determine the column (day) based on the x position
    const columnWidth = (calendarRect.width - timeColumnWidth) / 7;
    let column = Math.floor(x / columnWidth);
    column = Math.max(0, Math.min(6, column)); // Clamp between 0 and 6

    // Determine the time (row) based on y position with snapping to 15-minute intervals
    const intervalHeight = CELL_HEIGHT / INTERVALS_PER_CELL;
    let intervalIndex = Math.floor(y / intervalHeight);
    intervalIndex = Math.max(0, Math.min((timeSlots.length * INTERVALS_PER_CELL) - 1, intervalIndex));

    // Calculate the new start time in minutes
    const minutesFromStart = intervalIndex * MINUTES_INTERVAL;
    const newStartTimeMinutes = calendarStartTimeMinutes + minutesFromStart;
    
    // Find the original event to maintain its duration
    const originalEvent = events.find(evt => evt.id === draggingEventRef.current.id);
    const originalStartMinutes = timeToMinutes(originalEvent.startTime);
    const originalEndMinutes = timeToMinutes(originalEvent.endTime);
    const durationMinutes = originalEndMinutes - originalStartMinutes;
    
    // Calculate new end time based on original duration
    const newEndTimeMinutes = newStartTimeMinutes + durationMinutes;

    // Convert minutes back to formatted time strings
    const newStartTime = minutesToTime(newStartTimeMinutes);
    const newEndTime = minutesToTime(newEndTimeMinutes);
    const newDay = indexToDay[column];

    // Update the event in the state
    setEvents(prevEvents =>
      prevEvents.map(evt =>
        evt.id === draggingEventRef.current.id
          ? { ...evt, startTime: newStartTime, endTime: newEndTime, day: newDay }
          : evt
      )
    );
  };

  // Handle drag end: clean up
  const handleDragEnd = () => {
    draggingEventRef.current = null;
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // Calculate the event's position and height for rendering
  const getEventPosition = (evt) => {
    const columnIndex = dayToIndex[evt.day];
    const startTimeMinutes = timeToMinutes(evt.startTime);
    const endTimeMinutes = timeToMinutes(evt.endTime);
    
    // Calculate duration in minutes
    const durationMinutes = endTimeMinutes - startTimeMinutes;
    
    // Calculate position from calendar start
    const minutesFromStart = startTimeMinutes - calendarStartTimeMinutes;
    const intervalsFromStart = minutesFromStart / MINUTES_INTERVAL;
    
    // Calculate height based on duration (15 minutes = 1/4 of cell height)
    const heightInIntervals = durationMinutes / MINUTES_INTERVAL;
    const heightInPixels = (heightInIntervals * (CELL_HEIGHT / INTERVALS_PER_CELL)) - 2; // -2 for margins
    
    const columnPosition = `${(columnIndex / 7) * 100}%`;
    const columnWidth = `${100 / 7}%`;
    const rowPosition = `${intervalsFromStart * (CELL_HEIGHT / INTERVALS_PER_CELL)}px`;

    const isDragging =
      draggingEventRef.current && draggingEventRef.current.id === evt.id;
    return { 
      left: columnPosition, 
      width: columnWidth, 
      top: rowPosition, 
      heightInPx: heightInPixels,
      isDragging 
    };
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, []);

  return (
    <CalendarContainer>
      {/* Calendar Grid */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'auto',
          border: (theme) => `${BORDER_WIDTH}px solid ${theme.palette.divider}`,
          borderBottom: 0,
          position: 'relative'
        }}
      >
        {/* Day Headers */}
        <Grid container sx={{ borderBottom: BORDER_WIDTH, borderColor: 'divider' }}>
          <Grid item sx={{ width: 60 }}></Grid>
          {daysOfWeek.map((day, index) => (
            <Grid item key={index} xs>
              <DayHeader>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ py: 1 }}>
                  {day}
                </Typography>
              </DayHeader>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Body Container */}
        <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
          {/* Time Column */}
          <TimeColumn>
            {timeSlots.map((time, index) => (
              <TimeSlot key={index}>
                <Typography variant="caption">{time}</Typography>
              </TimeSlot>
            ))}
          </TimeColumn>

          {/* Main Grid Area */}
          <Box ref={calendarRef} sx={{ flex: 1, position: 'relative' }}>
            {/* Visual Grid Cells */}
            <Grid container sx={{ height: '100%' }}>
              {daysOfWeek.map((day, dayIndex) => (
                <Grid item key={dayIndex} xs>
                  {timeSlots.map((time, timeIndex) => (
                    <DayCell key={timeIndex} />
                  ))}
                </Grid>
              ))}
            </Grid>

            {/* Overlay for Events */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            >
              {events.map((evt) => {
                const position = getEventPosition(evt);
                return (
                  <Box
                    key={evt.id}
                    sx={{
                      position: 'absolute',
                      left: position.left,
                      width: position.width,
                      top: position.top,
                      zIndex: position.isDragging ? 100 : 10
                    }}
                  >
                    <EventItem
                      elevation={position.isDragging ? 8 : 1}
                      bgcolor={evt.color}
                      isDragging={position.isDragging}
                      heightInPx={position.heightInPx}
                      onMouseDown={(e) => handleDragStart(evt, e)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {evt.title}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ p: 0, color: 'inherit' }}
                          onClick={(e) => handleMenuOpen(e, evt.id)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="caption">
                        {`${evt.startTime} - ${evt.endTime}`}
                      </Typography>
                    </EventItem>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Menu for Event Options */}
      {/* Menu for Event Options */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditEvent}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteEvent} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* Edit Event Modal */}
      <Dialog open={editModalOpen} onClose={handleEditModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Lesson</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Lesson Title"
              type="text"
              fullWidth
              variant="outlined"
              value={editFormData.title || ''}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="day-select-label">Day</InputLabel>
              <Select
                labelId="day-select-label"
                name="day"
                value={editFormData.day || ''}
                label="Day"
                onChange={handleFormChange}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="start-time-select-label">Start Time</InputLabel>
                  <Select
                    labelId="start-time-select-label"
                    name="startTime"
                    value={editFormData.startTime || ''}
                    label="Start Time"
                    onChange={handleFormChange}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={`start-${time}`} value={time}>{time}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="end-time-select-label">End Time</InputLabel>
                  <Select
                    labelId="end-time-select-label"
                    name="endTime"
                    value={editFormData.endTime || ''}
                    label="End Time"
                    onChange={handleFormChange}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={`end-${time}`} value={time}>{time}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {editFormData.startTime && editFormData.endTime && 
                     timeToMinutes(editFormData.endTime) <= timeToMinutes(editFormData.startTime) ? 
                      'End time must be after start time' : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditModalClose}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={
                !editFormData.title || 
                !editFormData.day || 
                !editFormData.startTime || 
                !editFormData.endTime ||
                (editFormData.startTime && editFormData.endTime && 
                 timeToMinutes(editFormData.endTime) <= timeToMinutes(editFormData.startTime))
              }
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: 'background.paper',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'background.paper',
            opacity: 0.9
          }
        }}
      >
        <AddIcon />
      </Fab>
    </CalendarContainer>
  );
};

export default TeacherCalendar;