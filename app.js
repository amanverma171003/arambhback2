const baseUrl = 'http://localhost:3000';

// Helper function to display messages
const showMessage = (message, type) => {
  const alertBox = document.createElement('div');
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  document.body.prepend(alertBox);
  setTimeout(() => {
    alertBox.remove();
  }, 3000);
};

// Load places and events on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchPlaces();
  fetchEvents();
});

// Fetch places from the API
const fetchPlaces = () => {
  fetch(`${baseUrl}/places`)
    .then(response => response.json())
    .then(data => {
      const placesList = document.getElementById('placesList');
      placesList.innerHTML = '';
      data.forEach(place => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
          <div>
            <strong>${place.name}</strong>
            <div>${place.location}</div>
            <div>${place.description}</div>
          </div>
          <img src="${place.imageUrl}" alt="${place.name}" class="img-thumbnail">
          <div>
            <button class="btn btn-warning btn-sm mr-2" onclick="editPlace('${place._id}', '${place.name}', '${place.description}', '${place.location}', '${place.imageUrl}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deletePlace('${place._id}')">Delete</button>
          </div>
        `;
        placesList.appendChild(listItem);
      });
    })
    .catch(error => showMessage('Error fetching places', 'danger'));
};

// Fetch events from the API
const fetchEvents = () => {
  fetch(`${baseUrl}/events`)
    .then(response => response.json())
    .then(data => {
      const eventsList = document.getElementById('eventsList');
      eventsList.innerHTML = '';
      data.forEach(event => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
          <div>
            <strong>${event.name}</strong>
            <div>${event.location}</div>
            <div>${event.description}</div>
            <div>${new Date(event.date).toLocaleDateString()}</div>
          </div>
          <img src="${event.imageUrl}" alt="${event.name}" class="img-thumbnail">
          <div>
            <button class="btn btn-warning btn-sm mr-2" onclick="editEvent('${event._id}', '${event.name}', '${event.description}', '${event.date}', '${event.location}', '${event.imageUrl}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEvent('${event._id}')">Delete</button>
          </div>
        `;
        eventsList.appendChild(listItem);
      });
    })
    .catch(error => showMessage('Error fetching events', 'danger'));
};

// Add a new place
document.getElementById('placeForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('placeName').value;
  const description = document.getElementById('placeDescription').value;
  const location = document.getElementById('placeLocation').value;
  const imageUrl = document.getElementById('placeImageUrl').value;

  const place = { name, description, location, imageUrl };

  fetch(`${baseUrl}/places`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(place)
  })
    .then(response => response.json())
    .then(data => {
      showMessage('Place added successfully', 'success');
      fetchPlaces();
      document.getElementById('placeForm').reset();
    })
    .catch(error => showMessage('Error adding place', 'danger'));
});

// Add a new event
document.getElementById('eventForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('eventName').value;
  const description = document.getElementById('eventDescription').value;
  const date = document.getElementById('eventDate').value;
  const location = document.getElementById('eventLocation').value;
  const imageUrl = document.getElementById('eventImageUrl').value;

  const event = { name, description, date, location, imageUrl };

  fetch(`${baseUrl}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(response => response.json())
    .then(data => {
      showMessage('Event added successfully', 'success');
      fetchEvents();
      document.getElementById('eventForm').reset();
    })
    .catch(error => showMessage('Error adding event', 'danger'));
});

// Delete a place
const deletePlace = (id) => {
  fetch(`${baseUrl}/places/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      showMessage('Place deleted successfully', 'success');
      fetchPlaces();
    })
    .catch(error => showMessage('Error deleting place', 'danger'));
};

// Delete an event
const deleteEvent = (id) => {
  fetch(`${baseUrl}/events/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      showMessage('Event deleted successfully', 'success');
      fetchEvents();
    })
    .catch(error => showMessage('Error deleting event', 'danger'));
};

// Edit a place
const editPlace = (id, name, description, location, imageUrl) => {
  document.getElementById('placeName').value = name;
  document.getElementById('placeDescription').value = description;
  document.getElementById('placeLocation').value = location;
  document.getElementById('placeImageUrl').value = imageUrl;

  document.getElementById('placeForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedPlace = {
      name: document.getElementById('placeName').value,
      description: document.getElementById('placeDescription').value,
      location: document.getElementById('placeLocation').value,
      imageUrl: document.getElementById('placeImageUrl').value
    };

    fetch(`${baseUrl}/places/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPlace)
    })
      .then(response => response.json())
      .then(data => {
        showMessage('Place updated successfully', 'success');
        fetchPlaces();
        document.getElementById('placeForm').reset();
      })
      .catch(error => showMessage('Error updating place', 'danger'));
  }, { once: true });
};

// Edit an event
const editEvent = (id, name, description, date, location, imageUrl) => {
  document.getElementById('eventName').value = name;
  document.getElementById('eventDescription').value = description;
  document.getElementById('eventDate').value = new Date(date).toISOString().split('T')[0];
  document.getElementById('eventLocation').value = location;
  document.getElementById('eventImageUrl').value = imageUrl;

  document.getElementById('eventForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedEvent = {
      name: document.getElementById('eventName').value,
      description: document.getElementById('eventDescription').value,
      date: document.getElementById('eventDate').value,
      location: document.getElementById('eventLocation').value,
      imageUrl: document.getElementById('eventImageUrl').value
    };

    fetch(`${baseUrl}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedEvent)
    })
      .then(response => response.json())
      .then(data => {
        showMessage('Event updated successfully', 'success');
        fetchEvents();
        document.getElementById('eventForm').reset();
      })
      .catch(error => showMessage('Error updating event', 'danger'));
  }, { once: true });
};
