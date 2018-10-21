from ourchive import Ourchive

import sys
import os

basestring = getattr(__builtins__, 'basestring', str)

def config_str_to_obj(cfg):
    if isinstance(cfg, basestring):
        module = __import__('config', fromlist=[cfg])
        return getattr(module, cfg)
    return cfg


def app_factory(config, app_name):
    app = Ourchive(app_name)
    config = config_str_to_obj(config)
    app.configure(config)
    app.configure_database()
    app.setup()
    return app