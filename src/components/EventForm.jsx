// src/components/EventForm.jsx
import React, { useState, useContext } from 'react';
import { format } from 'date-fns';
import { EventContext } from '../context/EventContext';
import './EventForm.css'; // Make sure to create this CSS file

const recurrenceOptions = [
  { value: 'none', label: 'No recurrence' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const EventForm = ({ date, onClose, eventToEdit }) => {
  const { addEvent, updateEvent } = useContext(EventContext);
  
  // Initialize form state
  const [event, setEvent] = useState(() => {
    const defaultDate = date || new Date();
    return eventToEdit ? {
      ...eventToEdit,
      date: format(new Date(eventToEdit.date), 'yyyy-MM-dd'),
      time: format(new Date(eventToEdit.date), 'HH:mm')
    } : {
      title: '',
      date: format(defaultDate, 'yyyy-MM-dd'),
      time: '12:00',
      description: '',
      recurrence: 'none',
      color: '#3a87ad'
    };
  });

  const [errors, setErrors] = useState({});
  const [conflictMessage, setConflictMessage] = useState(''); // New state for conflict messages

  const handleSubmit = async (e) => { // Made handleSubmit async
    e.preventDefault();
    setConflictMessage(''); // Clear previous conflict messages

    // Validation
    const newErrors = {};
    if (!event.title.trim()) newErrors.title = 'Title is required';
    if (!event.date) newErrors.date = 'Date is required';
    if (!event.time) newErrors.time = 'Time is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Combine date and time into a single Date object for submission
    const dateTime = new Date(`${event.date}T${event.time}`);
    
    const eventToSave = {
      ...event,
      date: dateTime,
      id: eventToEdit?.id || Date.now().toString()
    };

    let success = false;
    if (eventToEdit) {
      success = await updateEvent(eventToSave); // Await the updateEvent call
    } else {
      success = await addEvent(eventToSave); // Await the addEvent call
    }

    if (success) {
      onClose();
    } else {
      // The addEvent or updateEvent function already shows an alert,
      // but you could set a more custom message here if needed.
      // setConflictMessage('This event conflicts with an existing event. Please choose a different time.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{eventToEdit ? 'Edit Event' : 'Add Event'}</h2>
        
        <form onSubmit={handleSubmit}>
          {conflictMessage && <p className="error-message">{conflictMessage}</p>} {/* Display conflict message */}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input
                id="time"
                type="time"
                name="time"
                value={event.time}
                onChange={handleChange}
                className={errors.time ? 'error' : ''}
              />
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={event.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="recurrence">Recurrence</label>
              <select
                id="recurrence"
                name="recurrence"
                value={event.recurrence}
                onChange={handleChange}
              >
                {recurrenceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Color</label>
              <div className="color-picker">
                <input
                  id="color"
                  type="color"
                  name="color"
                  value={event.color}
                  onChange={handleChange}
                />
                <span className="color-preview" style={{ backgroundColor: event.color }} />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {eventToEdit ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;