from ourchive import Ourchive
import sys
import os

basestring = getattr(__builtins__, 'basestring', str)


def config_str_to_obj(cfg):
    if isinstance(cfg, basestring):
        module = __import__('config', fromlist=[cfg])
        return getattr(module, cfg)
    return cfg

app = Ourchive('ourchive')
config = config_str_to_obj('Dev')
app.configure(config)
app.configure_database()
app.setup_celery()
celery = app.celery
