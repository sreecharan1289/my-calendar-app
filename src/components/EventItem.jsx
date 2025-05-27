// components/EventItem.jsx
import React, { useContext, useState } from 'react';
import { EventContext } from '../context/EventContext';

const EventItem = ({ event, onEdit }) => { // Added onEdit prop
  const { deleteEvent } = useContext(EventContext); // Removed setEventToEdit from context
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('eventId', event.id);
  };

  return (
    <div 
      className="event-item" 
      style={{ backgroundColor: event.color }}
      onClick={() => onEdit(event)} // Call onEdit instead of setEventToEdit directly
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable="true" // Make draggable
      onDragStart={handleDragStart} // Handle drag start
    >
      <span>{event.title}</span>
      {isHovered && (
        <button 
          className="delete-event" 
          onClick={(e) => {
            e.stopPropagation();
            deleteEvent(event.id);
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default EventItem;