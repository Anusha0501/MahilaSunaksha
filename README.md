# Mahila Sunaksha: Women’s Safety Web Application
![logo](https://github.com/user-attachments/assets/7f00ba07-ec41-477b-83b5-960ca5823359)

## Overview
Mahila Sunaksha is a web application designed to enhance women's safety by providing real-time, data-driven route suggestions. By calculating safety scores for each district based on crime rates, it helps users select the safest routes and avoid high-risk areas. The app integrates live crime data, empowering women to make informed travel decisions, thereby promoting security in communities.

## Features
- **Real-time Safety Scores**: Calculates district-wise safety scores based on crime data to suggest the safest routes.
- **Interactive Maps**: Displays routes with safety ratings on interactive maps.
- **User Reports**: Allows users to report unsafe areas, helping others avoid potential risks.
- **Route Planning**: Helps users plan safe paths based on district crime data.

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript – UI design and client-side scripting.
- **Leaflet.js**: Interactive maps to display routes.
- **OpenCage API**: Geocoding services to convert location names into geographic coordinates.
- **Backend**: Python and Flask – HTTP requests, routing, and server-side logic.
- **Database**: MySQL – Stores district-wise crime data and user reports.
- **Data Processing**: Pandas and NumPy – Used to process and analyze crime data to generate safety scores.
- **Crime Data**: Government Crime Dataset – Used to calculate safety scores for districts.

## How It Works
1. **Route Safety Calculation**: The app calculates a safety score for each district based on crime rates from the dataset, guiding users to the safest routes.
2. **Crime Reporting**: Users can report unsafe areas, contributing to the dataset and helping others avoid those zones.
3. **Interactive Map**: The user interacts with a map to choose their route, with safety scores visible for each district along the way.

## Use Cases
- **Late-night travel**: A woman uses Mahila Sunaksha to find the safest route for her late-night travel, avoiding high-crime areas.
- **Incident Reporting**: After completing her journey, a user reports an unsafe area due to an incident or crime witnessed, helping future travelers.
- **Daily Commute**: A woman uses the app daily to ensure she follows the safest route to and from work.
- **Group Outing**: A group of women uses the app to plan the safest path for their outing, avoiding risky areas.

## Getting Started
To get started with the project, clone this repository and follow the setup instructions.

```bash
git clone https://github.com/yourusername/mahilasunaksha.git
cd mahabasunaksha
```

### Installation

1. Install necessary dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up your MySQL database and import the crime dataset.

3. Run the Flask application:
   ```bash
   python app.py
   ```

4. Open the application in your browser at `http://localhost:5000`.

## Contributing
Feel free to fork the repository, create a new branch, and submit pull requests. Contributions are welcome!
