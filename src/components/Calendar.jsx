// components/Calendar.jsx
import React, { useState, useContext } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, addMonths, subMonths, isSameMonth, isToday, isSameDay } from 'date-fns';
import './Calendar.css';
import EventItem from './EventItem';
import { EventContext } from '../context/EventContext';
import EventForm from './EventForm';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const { events, updateEvent } = useContext(EventContext); // Added updateEvent
  const [eventToEdit, setEventToEdit] = useState(null); // State to hold event being edited

  const renderHeader = () => (
    <div className="calendar-header">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>‹</button>
      <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>›</button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE';
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="day-name" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days-row">{days}</div>;
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setEventToEdit(null); // Clear any event being edited
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setShowEventForm(true);
  };

  const handleDrop = (e, dropDate) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('eventId');
    const event = events.find(ev => ev.id === eventId);

    if (event) {
      const updatedEvent = { ...event, date: dropDate };
      updateEvent(updatedEvent);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault(); // Allows the drop
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter(event => isSameDay(new Date(event.date), cloneDay));
        
        days.push(
          <div
            className={`cell ${!isSameMonth(day, monthStart) ? 'disabled' : ''} ${isToday(day) ? 'today' : ''}`}
            key={day}
            onClick={() => handleDayClick(cloneDay)}
            onDragOver={onDragOver} // Allow dropping
            onDrop={(e) => handleDrop(e, cloneDay)} // Handle drop
          >
            <span className="date">{format(day, 'd')}</span>
            <div className="events">
              {dayEvents.map(event => (
                <EventItem 
                  key={event.id} 
                  event={event} 
                  onEdit={handleEditEvent} // Pass onEdit prop
                />
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="row" key={day}>{days}</div>);
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {showEventForm && (
        <EventForm 
          date={selectedDate} 
          onClose={() => {
            setShowEventForm(false);
            setEventToEdit(null); // Clear eventToEdit when closing form
          }}
          eventToEdit={eventToEdit} // Pass event to edit
        />
      )}
    </div>
  );
};

export default Calendar;