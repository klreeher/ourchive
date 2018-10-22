import os
import unittest
import coverage
import commands
from flask_script import Manager, Server
from flask_migrate import MigrateCommand

COV = coverage.coverage(
    branch=True,
    include='server/*',
    omit=[
        'server/tests/*',
        'server/config.py',
        'server/flask_app/__init__.py'
    ]
)
COV.start()



def cov():
    """Runs the unit tests with coverage."""
    tests = unittest.TestLoader().discover('server/tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print('Coverage Summary:')
        COV.report()
        basedir = os.path.abspath(os.path.dirname(__file__))
        covdir = os.path.join(basedir, 'tmp/coverage')
        COV.html_report(directory=covdir)
        print('HTML version: file://%s/index.html' % covdir)
        COV.erase()
        return 0
    return 1


def create_db():
    """Creates the db tables."""
    db.create_all()


def drop_db():
    """Drops the db tables."""
    db.drop_all()


if __name__ == '__main__':
    from main import app_factory
    import config

    manager = Manager(app_factory)
    manager.add_option("-n", "--name", dest="app_name", required=False, default=config.project_name)
    manager.add_option("-c", "--config", dest="config", required=False, default=config.Dev)
    manager.add_command('db', MigrateCommand)
    manager.add_command('runserver', Server(host='0.0.0.0', port='5000'))
    manager.add_command("test", commands.Test())
    manager.run()
