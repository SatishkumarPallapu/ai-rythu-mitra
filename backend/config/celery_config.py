from celery import Celery

celery_app = Celery(
    "ai_rythu_mitra",
    broker="redis://localhost:6379/0",  # Replace with your Redis broker URL
    backend="redis://localhost:6379/0",
    include=["backend.tasks"]
)

# Optional configuration, see the application user guide.
celery_app.conf.update(
    result_expires=3600,
)