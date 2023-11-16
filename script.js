// Array to store the parsed CSV data
let events = [];
let history = [];
let availableIndices = [];

// Custom CSV parsing function
function parseCSV(text) {
    const lines = text.split('\n');
    const result = [];
    const regexPattern = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
  
    for (const line of lines) {
      let match;
      const values = [];
      while (match = regexPattern.exec(line)) {
        // Remove the quotes and any leading/trailing whitespaces that may appear due to splitting
        values.push(match[1].trim().replace(/^"|"$/g, ''));
      }
      result.push(values);
    }
    return result.slice(1); // Remove header row and return the result
  }

// Function to fetch and parse the CSV data
function loadEvents() {
    fetch('events.csv')
    .then(response => response.text())
    .then(text => {
        const rows = parseCSV(text).slice(1); // Remove header row and parse
        rows.forEach(cols => {
            if (cols.length >= 7) { // Only consider rows with enough columns
              events.push({
                  number: cols[0],
                  title: cols[1],
                  flavorText: cols[2],
                  effect: cols[3],
                  outpost: cols[4],
                  general: cols[5],
                  resources: cols[6].trim() // Trim potential newline characters
              });
            }
        });
        availableIndices = [...Array(events.length).keys()]; // Create array of indices
        console.log(events); // Debug: Log the events array to see if it's correct
    }).catch(error => {
        console.error('Error loading the CSV file:', error);
    });
}

// Function to display a random event
function showNewEvent() {
    if (availableIndices.length === 0) {
        // Clear all the event information fields
        document.getElementById('event-title').innerText = "<No hay más cartas de Evento disponibles. Mezclar!>";
        document.getElementById('event-number').innerText = '';
        document.getElementById('flavor-text').innerText = '';
        document.getElementById('effect-text').innerText = '';
        document.getElementById('general-text').innerText = '';
        document.getElementById('outpost-text').innerText = '';
        document.getElementById('resources-text').innerText = '';
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const eventIndex = availableIndices[randomIndex];
    availableIndices.splice(randomIndex, 1); // Remove the selected index
    history.push(eventIndex); // Add to history

    const event = events[eventIndex];
    document.getElementById('event-title').innerText = event.title;
    document.getElementById('event-number').innerText = '#' + event.number;
    document.getElementById('flavor-text').innerText = event.flavorText;
    
    // Update these to set the text content without the label
    document.getElementById('effect-text').innerText = event.effect;
    document.getElementById('general-text').innerText = event.general;
    document.getElementById('outpost-text').innerText = event.outpost;
    document.getElementById('resources-text').innerText = event.resources;
}

// Function to show history
function showHistory() {
    const historyModal = document.getElementById('history-modal');
    const historyContent = history.map(index => `# ${events[index].number}`).join('<br>');
    historyModal.querySelector('.modal-content p').innerHTML = historyContent;
    historyModal.style.display = 'block';
}

// Function to reset the application
function reset() {
    if (confirm("Mezclar maso de eventos?")) {
        history = [];
        availableIndices = [...Array(events.length).keys()];
        document.getElementById('event-title').innerText = "<click en 'Mostrar Evento' para empezar>";
        document.getElementById('event-number').innerText = '';
        document.getElementById('flavor-text').innerText = '';
        document.getElementById('effect-text').innerText = '';
        document.getElementById('general-text').innerText = '';
        document.getElementById('outpost-text').innerText = '';
        document.getElementById('resources-text').innerText = '';
    }
}

// Event listeners for buttons
document.getElementById('new-event').addEventListener('click', showNewEvent);
document.getElementById('history').addEventListener('click', showHistory);
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('history-modal').querySelector('.close').addEventListener('click', function() {
    document.getElementById('history-modal').style.display = 'none';
});

// Initialize the application
loadEvents();
