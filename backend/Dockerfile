# Select a base image that includes Python
FROM python:3.10.12-slim

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

# Set the working directory in the container
ENV APP_HOME /app
WORKDIR $APP_HOME

# Copy all files in the current directory into the container
COPY . .

# Install the required packages
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 5000

# Run the web service on container startup
# CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app
CMD ["python", "app.py"]
