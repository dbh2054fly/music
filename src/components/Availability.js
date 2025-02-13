import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography,
  Box
} from '@mui/material';

const AvailabilityGrid = () => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const times = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 10;
    return hour <= 12 ? `${hour}:00 am` : `${hour-12}:00 pm`;
  });

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
        maxWidth: '1000px', 
        margin: '0 auto',
        boxShadow: 2 
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
          }
        }}
      />
      <CardContent>
        <Box sx={{ overflowX: 'auto' }}>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'auto repeat(7, 1fr)',
              minWidth: '600px',
              gap: 0
            }}
          >
            {/* Time labels column */}
            <Box sx={{ gridColumn: '1' }}>
              {times.map((time) => (
                <Box 
                  key={time} 
                  sx={{ 
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    pr: 1
                  }}
                >
                  <Typography variant="body2">{time}</Typography>
                </Box>
              ))}
            </Box>

            {/* Day columns */}
            {days.map((day) => (
              <Box key={day} sx={{ gridColumn: 'auto' }}>
                <Box 
                  sx={{ 
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: 1,
                    borderColor: 'divider',
                    fontWeight: 'bold'
                  }}
                >
                  <Typography variant="body2">{day}</Typography>
                </Box>
                {times.map((time) => {
                  const slot = `${day}-${time}`;
                  return (
                    <Box
                      key={slot}
                      sx={{
                        height: '32px',
                        border: 1,
                        borderColor: 'divider',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        backgroundColor: selectedSlots.has(slot) ? 'primary.main' : 'transparent',
                        '&:hover': {
                          backgroundColor: selectedSlots.has(slot) 
                            ? 'primary.main' 
                            : 'action.hover'
                        }
                      }}
                      onMouseDown={() => handleMouseDown(slot)}
                      onMouseEnter={() => handleMouseEnter(slot)}
                      onMouseUp={handleMouseUp}
                    />
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AvailabilityGrid;