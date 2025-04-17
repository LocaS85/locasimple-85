
# Flask Server Setup Instructions

This application uses a Flask backend for search functionality and data processing. Follow these instructions to set up and run the Flask server.

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Setup Instructions

1. Make sure you have Python installed on your system
2. Open a terminal or command prompt
3. Navigate to the project directory
4. Run the setup script:

### On macOS/Linux:
```bash
chmod +x start_flask_server.sh
./start_flask_server.sh
```

### On Windows:
```bash
start_flask_server.bat
```

## Manual Setup

If the scripts don't work for you, follow these manual steps:

1. Install the required packages:
```bash
pip install -r requirements.txt
```

2. Start the Flask server:
```bash
python app.py
```

## Configuring Mapbox

The application uses Mapbox for mapping features. You will need to set up a Mapbox account and token:

1. Create an account at [mapbox.com](https://www.mapbox.com/)
2. Get your public token from the Mapbox dashboard
3. Create a file named `.env` in the project root directory
4. Add the following line to the `.env` file:
```
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

## Troubleshooting

If you encounter any issues:

- Make sure Python and pip are installed and accessible from your command line
- Check that all required packages are installed
- Verify that your Mapbox token is valid and correctly configured
- Check console output for error messages
