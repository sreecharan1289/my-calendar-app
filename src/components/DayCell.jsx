// components/DayCell.jsx
import React from 'react';
import { isSameMonth, isToday } from 'date-fns';
import EventItem from './EventItem';

const DayCell = ({ day, monthStart, events, onDayClick }) => {
  const dayEvents = events.filter(event => 
    new Date(event.date).toDateString() === day.toDateString()
  );

  return (
    <div
      className={`cell ${!isSameMonth(day, monthStart) ? 'disabled' : ''} ${isToday(day) ? 'today' : ''}`}
      onClick={() => onDayClick(day)}
    >
      <span className="date">{day.getDate()}</span>
      <div className="events">
        {dayEvents.map(event => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default DayCell;