import os
basedir = os.path.abspath(os.path.dirname(__file__))
postgres_local_base = 'postgresql://postgres:F4rG0==nd@localhost/'
database_name = 'ourchive'


class BaseConfig:
    SECRET_KEY = os.getenv('SECRET_KEY', 'bad_policy')
    DEBUG = False
    BCRYPT_LOG_ROUNDS = 13
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    RESULT_PAGES = 25
    UPLOAD_TYPE = 'aws'
    USE_ES = True


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = postgres_local_base + database_name
    UPLOAD_ROOT = 'https://s3.us-east-2.amazonaws.com/ourchive-test-bucket/'
    UPLOAD_FOLDER = '/home/imp/projects/ourchive/server/flask_app/uploads'
    AWS_BUCKET = 'ourchive-test-bucket'
    APP_ROOT = 'http://127.0.0.1:5000'
    ADMIN_USER = 'administrator@stopthatimp.net'
    ADMIN_USER_PASSWORD = 'CHANGEME'
    EMAIL_SMTP = 'smtp.zoho.com'


class TestingConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = postgres_local_base + database_name + '_test'
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    USE_ES = False
    TEST_FILE_LOC = '/home/imp/projects/ourchive/server/tests/'


class ProductionConfig(BaseConfig):
    SECRET_KEY = 'change_me'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'postgresql:///example'