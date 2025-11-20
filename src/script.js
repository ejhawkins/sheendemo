document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('calendar-header');
    const timeColumn = document.getElementById('time-column');
    const gridContainer = document.getElementById('grid-container');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    // Modal elements
    const modal = document.getElementById('event-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalTime = document.getElementById('modal-time');
    const modalDetails = document.getElementById('modal-details');
    const modalVideo = document.getElementById('modal-video');
    const modalCloseButtons = document.querySelectorAll('[data-close]');

    modalCloseButtons.forEach(btn => btn.addEventListener('click', closeModal));

    function openModal({ title, startHour, durationHours, data, videoUrl }) {
        modalTitle.textContent = title;
        modalTime.textContent = `${startHour}:00 - ${startHour + durationHours}:00`;
        if (data) {
            modalDetails.textContent = Object.entries(data)
                .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
                .join('\n');
        } else {
            modalDetails.textContent = 'No additional details.';
        }

        if (videoUrl) {
            // Clear existing children and set a source element
            modalVideo.pause();
            modalVideo.src = videoUrl;
            modalVideo.load();
            modalVideo.play().catch(() => {
                // Autoplay might be blocked; that's fine on mobile user will tap play
            });
            modalVideo.style.display = '';
        } else {
            modalVideo.pause();
            modalVideo.removeAttribute('src');
            modalVideo.load();
            modalVideo.style.display = 'none';
        }

        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        // Stop and unload video
        try { modalVideo.pause(); } catch (e) {}
        try { modalVideo.removeAttribute('src'); modalVideo.load(); } catch (e) {}
    }

    // Close modal when clicking overlay
    document.querySelectorAll('.modal-overlay').forEach(el => {
        el.addEventListener('click', closeModal);
    });

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
    function addEvent(dayIndex, startHour, durationHours, title, data, imageUrl, videoUrl) {
        const dayColumn = gridContainer.querySelector(`.day-column[data-day-index='${dayIndex}']`);
        if (!dayColumn) return;

        const eventElem = document.createElement('div');
        eventElem.className = 'event';
        eventElem.innerHTML = `<div class="event-title">${title}</div>`;

        if (imageUrl) {
            eventElem.style.backgroundImage = `url('${imageUrl}')`;
        }

        // Place event using grid row start/end instead of absolute positioning
        eventElem.style.gridRowStart = startHour + 1;
        eventElem.style.gridRowEnd = startHour + durationHours + 1;

        eventElem.addEventListener('click', () => {
            openModal({ title, startHour, durationHours, data, videoUrl });
        });

        dayColumn.appendChild(eventElem);
    }

    // --- Add some sample events with video URLs (mobile-friendly MP4) ---
    addEvent(3, 10, 2, 'Hair Appointment', { agenda: 'Discuss Consultation' }, 'https://picsum.photos/seed/1/200/300', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
    addEvent(1, 12, 1, 'Her Lips Lip Gloss', { product: 'Her Lips' }, 'https://picsum.photos/seed/2/200/300', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/boat.mp4');
    addEvent(5, 9, 3, 'Interview with Sheen Magazine', { project: 'Erica Hawkins Candidate for Video Editor' }, 'https://picsum.photos/seed/3/200/300', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
});
