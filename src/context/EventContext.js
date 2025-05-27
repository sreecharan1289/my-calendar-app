// src/context/EventContext.js
import { createContext, useState, useEffect } from 'react';
import { addDays, addWeeks, addMonths } from 'date-fns'; // Removed parseISO as it's not used here

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Load events from localStorage on initial render
  useEffect(() => {
    const loadEvents = () => {
      const storedEvents = localStorage.getItem('calendarEvents');
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          // Convert string dates back to Date objects
          const processedEvents = parsedEvents.map(event => ({
            ...event,
            date: new Date(event.date)
          }));
          setEvents(processedEvents);
        } catch (error) {
          console.error('Failed to parse stored events', error);
          localStorage.removeItem('calendarEvents');
        }
      }
    };
    loadEvents();
  }, []);

  // Save to localStorage whenever events change
  useEffect(() => {
    const saveEvents = () => {
      // Convert Date objects to strings for storage
      const eventsForStorage = events.map(event => ({
        ...event,
        date: event.date.toISOString()
      }));
      localStorage.setItem('calendarEvents', JSON.stringify(eventsForStorage));
    };
    saveEvents();
  }, [events]);

  // Generate recurring events based on pattern
  const generateRecurringEvents = (baseEvent) => {
    const recurringEvents = [baseEvent];
    
    if (baseEvent.recurrence === 'daily') {
      for (let i = 1; i <= 30; i++) { // 30 days of daily recurrence
        recurringEvents.push({
          ...baseEvent,
          id: `${baseEvent.id}_${i}`,
          date: addDays(baseEvent.date, i),
          isRecurringInstance: true
        });
      }
    }
    else if (baseEvent.recurrence === 'weekly') {
      for (let i = 1; i <= 12; i++) { // 12 weeks of weekly recurrence
        recurringEvents.push({
          ...baseEvent,
          id: `${baseEvent.id}_${i}`,
          date: addWeeks(baseEvent.date, i),
          isRecurringInstance: true
        });
      }
    }
    else if (baseEvent.recurrence === 'monthly') {
      for (let i = 1; i <= 12; i++) { // 12 months of monthly recurrence
        recurringEvents.push({
          ...baseEvent,
          id: `${baseEvent.id}_${i}`,
          date: addMonths(baseEvent.date, i),
          isRecurringInstance: true
        });
      }
    }

    return recurringEvents;
  };

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      date: new Date(event.date), // Ensure it's a Date object
      isRecurringInstance: false
    };

    const eventsToAdd = event.recurrence === 'none' 
      ? [newEvent] 
      : generateRecurringEvents(newEvent);

    setEvents(prev => [...prev, ...eventsToAdd]);
  };

  const updateEvent = (updatedEvent) => {
    // If updating a recurring event, we need to update all instances
    if (updatedEvent.isRecurringInstance) {
      const baseId = updatedEvent.id.split('_')[0];
      setEvents(prev => {
        const newEvents = prev.filter(event => 
          !(event.id === baseId || event.id.startsWith(`${baseId}_`))
        );
        const baseEvent = { ...updatedEvent, id: baseId, isRecurringInstance: false };
        return [...newEvents, ...generateRecurringEvents(baseEvent)];
      });
    } else {
      // Find the existing event to see if its recurrence changed
      const existingEvent = events.find(event => event.id === updatedEvent.id);
      
      if (existingEvent && existingEvent.recurrence !== updatedEvent.recurrence) {
        // If recurrence changed, remove all previous instances and add new ones
        setEvents(prev => {
          const filteredEvents = prev.filter(event => 
            !(event.id === updatedEvent.id || event.id.startsWith(`${updatedEvent.id}_`))
          );
          return [...filteredEvents, ...generateRecurringEvents(updatedEvent)];
        });
      } else {
        setEvents(prev => 
          prev.map(event => 
            event.id === updatedEvent.id ? { ...updatedEvent, date: new Date(updatedEvent.date) } : event
          )
        );
      }
    }
  };

  const deleteEvent = (id) => {
    // If deleting a recurring event, delete all instances
    if (id.includes('_')) {
      const baseId = id.split('_')[0];
      setEvents(prev => prev.filter(event => 
        !(event.id === baseId || event.id.startsWith(`${baseId}_`))
      ));
    } else {
      setEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  return (
    <EventContext.Provider 
      value={{ 
        events, 
        addEvent, 
        updateEvent, 
        deleteEvent
      }}
    >
      {children}
    </EventContext.Provider>
  );
};