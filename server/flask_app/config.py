import os
postgres_local_base = 'postgresql://ourchive:ourchive@'
database_name = 'ourchivedb'
project_name = "ourchive"


class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY', 'bad_policy')
    DEBUG = False
    BCRYPT_LOG_ROUNDS = 13
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    RESULT_PAGES = 25
    UPLOAD_TYPE = 'file'
    USE_ES = True

# config class for development environment
class Dev(Config):
    DEBUG = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = postgres_local_base + 'postgres/' + database_name
    UPLOAD_ROOT = '/ourchive/tus-data/data/'
    UPLOAD_FOLDER = '/ourchive/tus-data/data/'
    UPLOAD_SUFFIX = '.bin'
    AWS_BUCKET = 'ourchive-test-bucket'
    APP_ROOT = 'http://127.0.0.1:5000'
    ADMIN_USER = 'administrator@stopthatimp.net'
    ADMIN_USER_PASSWORD = 'CHANGEME'
    EMAIL_SMTP = 'smtp.zoho.com'
    TUS_ENDPOINT = 'http://127.0.0.1:1080/files/'
    REDIS_SERVERNAME = 'redis'
    REDIS_PORT=6379
    RESULT_PAGES=15
    REDIS_PASSWORD='devpassword'
    ELASTICSEARCH_SERVERNAME='elasticsearch'
    BUCKET_URL='https://s3.us-east-2.amazonaws.com/ourchive-test-bucket/'

# config class used during tests
class Test(Config):
    DEBUG = True
    TESTING = True
    BCRYPT_LOG_ROUNDS = 4
    UPLOAD_ROOT = 'server/flask_app/tests/'
    UPLOAD_FOLDER = 'server/flask_app/tests/uploads'
    SQLALCHEMY_DATABASE_URI = postgres_local_base + 'postgres-test/' +database_name + '_test'
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    USE_ES = False
    UPLOAD_SUFFIX = ''
    TEST_FILE_LOC = 'server/flask_app/tests/'
    REDIS_SERVERNAME = 'redis-test'
    REDIS_PASSWORD='devpassword'
    REDIS_PORT=6379
    ELASTICSEARCH_SERVERNAME='elasticsearch'


class ProductionConfig(Config):
    SECRET_KEY = 'change_me'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'postgresql:///example'
    TUS_ENDPOINT = 'http://ourchive-dev.stopthatimp.net/uploads'
