import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography,
  Box
} from '@mui/material';

//generates a list of objects that contain the display hour and respective minute slots
export const generateTimeSlots = () => {
  const timeSlots = []
  for(let hour = 0; hour < 24; hour++){
    //get the display hour for each hour of the day
    let displayHour;
    if (hour === 0) {
      displayHour = "12:00 am";
    } else if (hour === 12) {
      displayHour = "12:00 pm";
    } else if (hour < 12) {
      displayHour = `${hour}:00 am`;
    } else {
      displayHour = `${hour-12}:00 pm`;
    }

    //get the time slots for each hour
    const minutes = [0, 15, 30, 45]
    const slots = minutes.map(m =>({
      display: displayHour,
      minutes: m,
      value: `${hour}:${m.toString().padStart(2, '0')}`
    }));

    timeSlots.push({
      hour: displayHour,
      ampm: displayHour.slice(-2),
      slots: slots
    });
  }
  return timeSlots;
}

const AvailabilityGrid = () => {
  // Inside your component, temporarily
  console.log(JSON.stringify(generateTimeSlots(), null, 2));
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timeSlots = generateTimeSlots();

  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isSelecting, setIsSelecting] = useState(true);

  const handleMouseDown = (slot) => {
    setIsMouseDown(true);
    setIsSelecting(!selectedSlots.has(slot));
    toggleSlot(slot);
  };

  const handleMouseEnter = (slot) => {
    if (isMouseDown) {
      toggleSlot(slot);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const toggleSlot = (slot) => {
    const newSelected = new Set(selectedSlots);
    if (isSelecting) {
      newSelected.add(slot);
    } else {
      newSelected.delete(slot);
    }
    setSelectedSlots(newSelected);
  };

  return (
    <Card 
      sx={{ 
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'flex-start',
        maxWidth: '1000px', 
        margin: '0px auto',
        boxShadow: 2,
        maxHeight: '600px'
      }}
      onMouseLeave={handleMouseUp}
    >
      <CardHeader 
        title="Select Your Availability" 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          '& .MuiCardHeader-title': {
            fontSize: '1.5rem',
            fontWeight: 'bold'
          },
          padding: '16px'
        }}
      />
      <CardContent
      sx={{ 
          padding: '16px !important', 
          '&:last-child': {
          paddingBottom: '16px !important', 
        },
        height: '100%', 
        overflow: 'auto'
      }}>
        <Box sx={{ overflowX: 'auto' }}>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: 'auto repeat(7, 1fr)',
            minWidth: '600px',
            height: 'fit-content',
            gap: 0
          }}
        >
          {/* Time labels column */}
          <Box sx={{ gridColumn: '1', display: 'grid', gridTemplateRows: '32px repeat(96, 12px)',height: 'fit-content' }}> {/* Reduced height for 15-min intervals */}
            {/* Header spacer */}
            <Box sx={{ 
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 1,
            borderBottom: 1,
            borderColor: 'divider'
          }}  />
            
            {timeSlots.map((timeBlock) => (
              // Each hour block gets 4 rows (15 min each)
              <Box 
                key={timeBlock.hour}
                sx={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  pr: 1,
                  gridRow: 'span 4',
                  border: 1,
                  borderColor: 'divider',
                  boxSizing: 'border-box',
                }}
              >
                {(
                  <Typography variant="body2">{timeBlock.hour}</Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* Day columns */}
          {days.map((day) => (
            <Box key={day} sx={{ gridColumn: 'auto', display: 'grid', gridTemplateRows: '32px repeat(auto-fill, 12px)' }}>
              <Box 
                sx={{ 
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  fontWeight: 'bold'
                }}
              >
                <Typography variant="body2">{day}</Typography>
              </Box>
              {timeSlots.flatMap((timeBlock) => 
                timeBlock.slots.map((slot) => {
                  const slotId = `${day}-${timeBlock.hour}-${slot.minutes}`;
                  return (
                    <Box
                      key={slotId}
                      sx={{
                        height: '12px', // 15-minute slot height
                        border: 1,
                        borderColor: 'divider',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        backgroundColor: selectedSlots.has(slotId) ? 'primary.main' : 'transparent',
                        '&:hover': {
                          backgroundColor: selectedSlots.has(slotId) 
                            ? 'primary.main' 
                            : 'action.hover'
                        }
                      }}
                      onMouseDown={() => handleMouseDown(slotId)}
                      onMouseEnter={() => handleMouseEnter(slotId)}
                      onMouseUp={handleMouseUp}
                    />
                  );
                })
              )}
            </Box>
          ))}
        </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AvailabilityGrid;