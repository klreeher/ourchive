from ..models import User, Notification
from server.flask_app.user import logic as user_logic
import sys
import os
import re
from smtplib import SMTP_SSL as SMTP
from email.mime.text import MIMEText
from flask import current_app as app
from .. import db

def get_user_notifications(user_id):
	notifications = User.query.filter_by(id=user_id).first().notifications
	notifications_json = []
	for notification in notifications:
		notifications_json.append(build_notification(notification))
	return notifications_json

def delete_notification(user_id, notification_id):
	notification = Notification.query.filter_by(id=notification_id).first()
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

def do_password_reset(user_id):
	user = User.query.filter_by(id=user_id).first()
	token = user_logic.add_reset(user)
	response = send_password_reset_email(token)
	if response != "":
		#todo log
		return 400
	else:
		return 201


def send_password_reset_email(token, email):
	SMTPserver = app.config.get('EMAIL_SMTP')
	sender =     app.config.get('EMAIL_SENDER')
	destination = [email]

	USERNAME = app.config.get('ADMIN_USER')
	PASSWORD = app.config.get('ADMIN_USER_PASSWORD')
	text_subtype = 'plain'


	content="""\
	We have received a password reset request for the account associated with this email. If you made this request, please follow the link to reset your password: 
	"""+app.config.get('APP_ROOT') + "/user/reset/"+token

	subject="Password reset requested"

	try:
	    msg = MIMEText(content, text_subtype)
	    msg['Subject']=       subject
	    msg['From']   = sender

	    conn = SMTP(SMTPserver)
	    conn.set_debuglevel(False)
	    conn.login(USERNAME, PASSWORD)
	    try:
	        conn.sendmail(sender, destination, msg.as_string())
	    finally:
	        conn.quit()
	        return ""

	except Exception as exc:
	    return "mail failed: " + str(exc)
