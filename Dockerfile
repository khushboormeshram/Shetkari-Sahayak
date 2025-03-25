# Use Python 3.9 as base
FROM python:3.9

# Create and switch to a user for security
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the project files
COPY --chown=user . /app

# Run the Flask app
CMD ["python", "app.py"]
