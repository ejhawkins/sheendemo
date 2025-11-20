document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('calendar-header');
    const timeColumn = document.getElementById('time-column');
    const gridContainer = document.getElementById('grid-container');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    // --- Generate Header ---
    for (let i = 0; i < 7; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - today.getDay() + i);
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.innerHTML = `
            <div class="day-name">${days[day.getDay()]}</div>
            <div class="day-number">${day.getDate()}</div>
        `;
        headerContainer.appendChild(dayHeader);
    }

    // --- Generate Time Column ---
    for (let hour = 0; hour < 24; hour++) {
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        if (hour > 0) {
            const time = (hour % 12 === 0) ? 12 : hour % 12;
            const ampm = hour < 12 ? 'AM' : 'PM';
            timeLabel.innerHTML = `<span>${time} ${ampm}</span>`;
        }
        timeColumn.appendChild(timeLabel);
    }

    // --- Generate Day Columns in Grid ---
    for (let i = 0; i < 7; i++) {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        dayColumn.dataset.dayIndex = i;
        gridContainer.appendChild(dayColumn);
    }

    // --- Function to place events ---
    function addEvent(dayIndex, startHour, durationHours, title) {
        const dayColumn = gridContainer.querySelector(`.day-column[data-day-index='${dayIndex}']`);
        if (!dayColumn) return;

        const eventElem = document.createElement('div');
        eventElem.className = 'event';
        eventElem.innerHTML = `<div class="event-title">${title}</div>`;

        const slotHeight = 60; // Corresponds to 1 hour
        eventElem.style.top = `${startHour * slotHeight}px`;
        eventElem.style.height = `${durationHours * slotHeight}px`;

        dayColumn.appendChild(eventElem);
    }

    // --- Add a sample event ---
    // Add an event on Wednesday (dayIndex 3) at 10 AM for 2 hours
    addEvent(3, 10, 2, 'Team Meeting');
});

