# ourchive

![Dream a bit bigger, darling.](inception-dream-bigger.gif)

## swagger spec

[swagger spec](https://swagger.io/docs/specification/2-0/paths-and-operations/)
=======
## tus-server for file upload
tus-server: bundle exec rackup -p 9292 -o 10.0.2.15 config.ru &

## development environment

prerequisites: python3, virtualenv or pipenv

ensure commands to python (including pip) are pointing to python3

    cd react-flask
    virtualenv venv
    . venv/bin/activate
    pip install -r requirements.txt
    sudo npm install -g webpack; npm install

Then: open 2 terminal windows (or sessions/whatever) to `ourchive/react-flask`.

In the first: `python app.py`

In the second: `webpack --watch`
