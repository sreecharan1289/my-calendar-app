// utils/dateUtils.js
import { format, parseISO, isSameDay, addDays, isBefore, isAfter } from 'date-fns';

export const formatEventDate = (dateString, timeString) => {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy') + ' at ' + timeString;
};

export const checkEventConflict = (events, newEvent) => {
  const newEventStart = new Date(`${newEvent.date}T${newEvent.time}`);
  const newEventEnd = new Date(newEventStart.getTime() + 60 * 60 * 1000); // Assuming 1hr duration
  
  return events.some(event => {
    const eventStart = new Date(`${event.date}T${event.time}`);
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);
    
    return (
      (isAfter(newEventStart, eventStart) && isBefore(newEventStart, eventEnd)) ||
      (isAfter(newEventEnd, eventStart) && isBefore(newEventEnd, eventEnd)) ||
      (isBefore(newEventStart, eventStart) && isAfter(newEventEnd, eventEnd))
    );
  });
};

export const generateRecurringEvents = (event) => {
  if (event.recurrence === 'none') return [event];
  
  const events = [event];
  const startDate = new Date(event.date);
  
  if (event.recurrence === 'daily') {
    for (let i = 1; i < 30; i++) { // Limit to 30 days for demo
      const newDate = addDays(startDate, i);
      events.push({
        ...event,
        id: `${event.id}-${i}`,
        date: format(newDate, 'yyyy-MM-dd')
      });
    }
  } else if (event.recurrence === 'weekly') {
    for (let i = 1; i < 12; i++) { // Limit to 12 weeks for demo
      const newDate = addDays(startDate, i * 7);
      events.push({
        ...event,
        id: `${event.id}-${i}`,
        date: format(newDate, 'yyyy-MM-dd')
      });
    }
  } else if (event.recurrence === 'monthly') {
    for (let i = 1; i < 12; i++) { // Limit to 12 months for demo
      const newDate = new Date(startDate);
      newDate.setMonth(startDate.getMonth() + i);
      events.push({
        ...event,
        id: `${event.id}-${i}`,
        date: format(newDate, 'yyyy-MM-dd')
      });
    }
  }
  
  return events;
};