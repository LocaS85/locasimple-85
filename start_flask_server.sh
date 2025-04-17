
#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Python 3 could not be found. Please install Python 3."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null
then
    echo "pip3 could not be found. Please install pip3."
    exit 1
fi

# Install required packages if not already installed
echo "Installing required packages..."
pip3 install -r requirements.txt

# Start the Flask server
echo "Starting Flask server..."
python3 app.py
