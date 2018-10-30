from flask import current_app as app

celery = app.create_celery_app()

@celery.task
def sample_task(msg):
    print(msg)