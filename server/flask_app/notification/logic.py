from ..models import User, Notification

def get_user_notifications(user_id):
	notifications = User.query.filter_by(id=user_id).first().notifications
	notifications_json = []
	for notification in notifications:
		notification_json.append(build_notification(notification))
	return notification_json

def delete_notification(user_id, notification_id):
	notification = Notification.query.filter_by(id=notification_id)
	if notification is None or user_id != notification.user_id:
		return None
	else:
		Notification.query.filter_by(id=notification_id).delete()
		db.session.commit()
	return {"Status": "Deleted"}

def delete_notification_by_user(user_id):
	notifications = User.query.filter_by(id=user_id).first().notifications
	for notification in notifications:
		Notification.query.filter_by(id=notification.id).delete()
	db.session.commit()
	return {"Status": "Deleted"}

def build_notification(notification):
	notification_json = {}
	notification_json['id'] = notification.id
	notification_json['content'] = notification.content
	notification_json['date_created'] = notification.date_created
	notification_json['route'] = notification.route
	notification_json['user_id'] = notification.user_id
	notification_json['notification_type_id'] = notification.notification_type_id
	return notification_json