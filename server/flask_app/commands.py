from flask_script import Command, Option, prompt_bool

import os
import config

class Test(Command):
    """
    Run tests
    """

    start_discovery_dir = "server/flask_app/tests"

    def get_options(self):
        return [
            Option('--start_discover', '-s', dest='start_discovery',
                   help='Pattern to search for features',
                   default=self.start_discovery_dir),
        ]

    def run(self, start_discovery):
        import unittest

        if os.path.exists(start_discovery):
            tests = unittest.TestLoader().discover('server/flask_app/tests', pattern='test_*.py')
            result = unittest.TextTestRunner(verbosity=2).run(tests)
            if result.wasSuccessful():
                return 0
            return 1
        else:
            print("Directory '%s' was not found in project root." % start_discovery)
