# Use Python 3.9
FROM python:3.9

# Create a user for security purposes
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy all other files
COPY --chown=user . /app

# Expose port 7860 for Hugging Face
EXPOSE 7860

# Run the Flask app
CMD ["python", "app.py"]
