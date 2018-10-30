from celery_app import celery

@celery.task
def sample_task(msg):
    print(msg)