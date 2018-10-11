FROM python:3.7
LABEL maintainer="Elena <c.elena.palmer@gmail.com>"
EXPOSE 5000

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get update && apt-get install nodejs build-essential libpq-dev git -y --no-install-recommends

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

RUN mkdir -p /ourchive
WORKDIR /ourchive
COPY . /ourchive

ENTRYPOINT ["python", "manage.py"]
CMD ["runserver"]
