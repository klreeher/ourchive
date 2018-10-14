import os
basedir = os.path.abspath(os.path.dirname(__file__))
postgres_local_base = 'postgresql://ourchive:ourchive@'
database_name = 'ourchivedb'


class BaseConfig:
    SECRET_KEY = os.getenv('SECRET_KEY', 'bad_policy')
    DEBUG = False
    BCRYPT_LOG_ROUNDS = 13
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    RESULT_PAGES = 25
    UPLOAD_TYPE = 'file'
    USE_ES = True


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = postgres_local_base + 'postgres/' + database_name
    UPLOAD_ROOT = '/home/imp/projects/ourchive/server/flask_app/uploads/'
    UPLOAD_FOLDER = '/home/imp/projects/ourchive/server/flask_app/uploads'
    AWS_BUCKET = 'ourchive-test-bucket'
    APP_ROOT = 'http://127.0.0.1:5000'
    ADMIN_USER = 'administrator@stopthatimp.net'
    ADMIN_USER_PASSWORD = 'CHANGEME'
    EMAIL_SMTP = 'smtp.zoho.com'
    TUS_ENDPOINT = 'http://127.0.0.1:5000/uploads'
    REDIS_SERVERNAME = 'redis'
    REDIS_PORT=6379


class TestingConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = postgres_local_base + 'postgres-test/' +database_name + '_test'
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    USE_ES = False
    TEST_FILE_LOC = '/ourchive/server/tests/'
    REDIS_SERVERNAME = 'redis-test'
    REDIS_PORT=6380


class ProductionConfig(BaseConfig):
    SECRET_KEY = 'change_me'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'postgresql:///example'
    TUS_ENDPOINT = 'http://ourchive-dev.stopthatimp.net/uploads'
