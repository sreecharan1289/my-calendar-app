// App.js
import Calendar from './components/Calendar';
import { EventProvider } from './context/EventContext';
import './App.css';

function App() {
  return (
    <div className="App">
      <EventProvider>
        <h1>Event Calendar</h1>
        <Calendar />
      </EventProvider>
    </div>
  );
}

export default App;