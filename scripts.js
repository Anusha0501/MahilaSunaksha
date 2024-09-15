const OPENCAGE_API_KEY = 'f70c1042f67043818d42e63b5d4a4e9d';

let map;
let routingControl;

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadRecentReports();
    loadSafetyData();  
});

function initMap() {
    map = L.map('map').setView([28.6139, 77.2090], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    routingControl = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true
    }).addTo(map);
}

function geocodeAddress(address, callback) {
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                callback([lat, lng]);
            } else {
                alert('Address not found.');
            }
        })
        .catch(error => {
            console.error('Error geocoding address:', error);
            alert('Error geocoding address.');
        });
}

let safetyData = [];

function loadSafetyData() {
    fetch('safety_scores.json')
        .then(response => response.json())
        .then(data => {
            safetyData = data;
            addHotspots(); 
        })
        .catch(error => {
            console.error('Error loading safety data:', error);
        });
}

function addHotspots() {
    safetyData.forEach(entry => {
        const { Latitude, Longitude, safety_score } = entry;
        
        let color;
        if (safety_score > 90) {
            color = '#77DD77'; // Pastel Green
        } else if (safety_score > 80) {
            color = '#B2B27F'; // Pastel Yellow-Green
        } else if (safety_score > 70) {
            color = '#FDFD96'; // Pastel Yellow
        } else if (safety_score > 60) {
            color = '#F6C4C4'; // Pastel Orange
        } else {
            color = '#FFB3B3'; // Pastel Red
        }

        L.circle([Latitude, Longitude], {
            color: color,
            fillColor: color,
            fillOpacity: 0.2,
            radius: 5000 
        }).addTo(map)
        .bindPopup(`<b>Safety Score: ${safety_score.toFixed(2)}</b>`);
    });
}



function getSafetyScore(lat, lng, callback) {
    let closestScore = 0;
    let minDistance = Infinity;

    safetyData.forEach(entry => {
        const distance = Math.sqrt(
            Math.pow(entry.Latitude - lat, 2) + Math.pow(entry.Longitude - lng, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestScore = entry.safety_score;
        }
    });

    callback(closestScore);
}

function findRoute() {
    const start = document.getElementById('start').value;
    const destination = document.getElementById('destination').value;
    const safetyScoresElement = document.getElementById('safety-scores');

    if (start && destination) {
        geocodeAddress(start, startCoords => {
            geocodeAddress(destination, endCoords => {
                routingControl.setWaypoints([
                    L.latLng(startCoords[0], startCoords[1]),
                    L.latLng(endCoords[0], endCoords[1])
                ]);

                getSafetyScore(startCoords[0], startCoords[1], startSafetyScore => {
                    getSafetyScore(endCoords[0], endCoords[1], endSafetyScore => {
                        safetyScoresElement.innerHTML = `Safety Score for Start: ${startSafetyScore.toFixed(2)}<br>Safety Score for Destination: ${endSafetyScore.toFixed(2)}`;
                    });
                });
            });
        });
    } else {
        alert('Please enter both start and destination.');
    }
}

let userId = 1;
function submitReport(event) {
    event.preventDefault();
    
     
    const incidentType = document.getElementById('incident-type').value;
    const incidentLocation = document.getElementById('incident-location').value;
    const incidentDescription = document.getElementById('incident-description').value;

    if (incidentType && incidentLocation && incidentDescription) {
        fetch('http://127.0.0.1:5000/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,  
                type: incidentType,
                location: incidentLocation,
                description: incidentDescription
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Report submitted successfully.');
                document.getElementById('report-form').reset();
                loadRecentReports(); 
                userId+=1;
            } else {
                alert(`Failed to submit report: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error submitting report:', error);
            alert('Error submitting report.');
        });
    } else {
        alert('Please fill in all fields.');
    }
}



function loadRecentReports() {
    fetch('http://127.0.0.1:5000/reports')
        .then(response => response.json())
        .then(data => {
            const reportList = document.getElementById('report-list');
            reportList.innerHTML = '';

            data.reports.forEach(report => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h3>${report.type}</h3>
                    <p><strong>Location:</strong> ${report.location}</p>
                    <p><strong>Description:</strong> ${report.description}</p>
                    <p><strong>Date:</strong> ${new Date(report.report_date).toLocaleDateString()}</p>
                `;
                reportList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error loading reports:', error);
        });
}

document.getElementById('find-route-btn').addEventListener('click', findRoute);
document.getElementById('report-form').addEventListener('submit', submitReport);

window.onload = function() {
    initMap();
    loadRecentReports();
};
