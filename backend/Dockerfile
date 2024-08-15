FROM python:3.12.2

WORKDIR /backend

COPY . /backend



RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000


ENV FLASK_APP=main.py

# Run flask when the container launches
CMD ["flask", "run", "--host=127.0.0.1"]
