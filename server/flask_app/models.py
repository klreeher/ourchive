import datetime
import jwt
import bcrypt
from database import db
from sqlalchemy.ext.declarative import declarative_base
from flask import current_app as app

Base = declarative_base()


work_tag_table = db.Table('work_tag_table',
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True),
    db.Column('work_id', db.Integer, db.ForeignKey('works.id'), primary_key=True)
)

bookmark_tag_table = db.Table('bookmark_tag_table',
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True),
    db.Column('bookmark_id', db.Integer, db.ForeignKey('bookmarks.id'), primary_key=True)
)

comment_to_comment = db.Table("comment_to_comment",
    db.Column("parent_comment_id", db.Integer, db.ForeignKey("comments.id"), primary_key=True),
    db.Column("child_comment_id", db.Integer, db.ForeignKey("comments.id"), primary_key=True)
)

message_to_message = db.Table("message_to_message",
    db.Column("parent_message_id", db.Integer, db.ForeignKey("messages.id"), primary_key=True),
    db.Column("child_message_id", db.Integer, db.ForeignKey("messages.id"), primary_key=True)
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.String(600), nullable=True)
    registered_on = db.Column(db.DateTime, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)
    banned = db.Column(db.Boolean, nullable=True, default=False)
    comments = db.relationship('Comment', backref='comment_user',
                                lazy='dynamic')
    works = db.relationship('Work', backref='work_user',
                                lazy='dynamic')
    bookmarks = db.relationship('Bookmark', backref='bookmark_user',
                                lazy='dynamic')

    notifications = db.relationship('Notification', backref='notification_user',
                                lazy='dynamic')

    received_messages = db.relationship('Message', foreign_keys="[Message.to_user_id]",
                                lazy='dynamic')

    sent_messages = db.relationship('Message', foreign_keys="[Message.from_user_id]",
                                lazy='dynamic')

    def __init__(self, email, password, admin=False, username=None):
        self.email = email
        password_bytes = bytes(password, 'utf-8')
        self.password = bcrypt.hashpw(
            password_bytes, bcrypt.gensalt()
        ).decode()
        self.registered_on = datetime.datetime.now()
        self.admin = admin
        self.username = username

    def encode_auth_token(self, user_id):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=14, seconds=0),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            is_blacklisted_token = BlacklistToken.check_blacklist(auth_token)
            if is_blacklisted_token:
                return 'Token blacklisted. Please log in again.'
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

class BlacklistToken(db.Model):

    __tablename__ = 'blacklist_tokens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_blacklist(auth_token):
        # check whether auth token has been blacklisted
        res = BlacklistToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False

class Work(db.Model):

    __tablename__ = 'works'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    work_summary = db.Column(db.String)
    work_notes = db.Column(db.String)
    is_complete = db.Column(db.Integer)
    word_count = db.Column(db.Integer)
    cover_url = db.Column(db.String)
    cover_alt_text = db.Column(db.String)
    created_on = db.Column(db.DateTime, server_default=db.func.now())
    updated_on = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    chapters = db.relationship('Chapter', backref='chapter_work',
                                lazy='dynamic', cascade='all,delete')

    bookmarks = db.relationship('Bookmark', backref='bookmark_work',
                                lazy='dynamic', cascade='all,delete')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='works')

    type_id = db.Column(db.Integer, db.ForeignKey('work_types.id') )
    work_type = db.relationship('WorkType', backref='type_works')

    tags = db.relationship('Tag', secondary=work_tag_table,
        backref=db.backref('work_tags', lazy='dynamic'), lazy='dynamic')

    def __repr__(self):
        return '<Work: {}>'.format(self.id)

class WorkType(db.Model):

    __tablename__ = 'work_types'

    id = db.Column(db.Integer, primary_key=True)
    type_name = db.Column(db.String(200))

    def __init__(self, type_name):
        self.type_name = type_name

    def __repr__(self):
        return '<WorkType: {}>'.format(self.id)

class Chapter(db.Model):

    __tablename__ = 'chapters'

    id = db.Column(db.Integer, primary_key=True)
    created_on = db.Column(db.DateTime, server_default=db.func.now())
    updated_on = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    title = db.Column(db.String(200))
    number = db.Column(db.Integer)
    text = db.Column(db.String)
    audio_url = db.Column(db.String)
    audio_length = db.Column(db.BigInteger)
    image_url = db.Column(db.String)
    image_alt_text = db.Column(db.String)
    image_format = db.Column(db.String)
    image_size = db.Column(db.String)
    summary = db.Column(db.String)
    comments = db.relationship('Comment', backref='comment_chapter',
                                lazy='dynamic')

    work_id = db.Column(db.Integer, db.ForeignKey('works.id', ondelete='CASCADE'))
    work = db.relationship('Work', back_populates='chapters')

    def __repr__(self):
        return '<Chapter: {}>'.format(self.id)

class Comment(db.Model):

    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    user = db.relationship('User', back_populates='comments')

    chapter_id = db.Column(db.Integer, db.ForeignKey('chapters.id', ondelete='CASCADE'))
    chapter = db.relationship('Chapter', back_populates='comments')

    bookmark_id = db.Column(db.Integer, db.ForeignKey('bookmarks.id', ondelete='CASCADE'))
    bookmark = db.relationship('Bookmark', back_populates='comments')


    comments = db.relationship("Comment",
                        secondary=comment_to_comment,
                        primaryjoin=id==comment_to_comment.c.parent_comment_id,
                        secondaryjoin=id==comment_to_comment.c.child_comment_id,
                        backref="parent_comment"
                )

    def __repr__(self):
        return '<Comment: {}>'.format(self.id)

class Tag(db.Model):

    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(120))
    tag_type_id = db.Column(db.Integer, db.ForeignKey('tag_types.id', ondelete='CASCADE'))
    tag_type = db.relationship('TagType', back_populates='tags')

    def __repr__(self):
        return '<Tag: {}>'.format(self.id)

class TagType(db.Model):

    __tablename__ = 'tag_types'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    label = db.Column(db.String(200))
    tags = db.relationship('Tag', back_populates='tag_type')

    def __init__(self, label=None):
        self.label = label

    def __repr__(self):
        return '<TagType: {}>'.format(self.id)

class Bookmark(db.Model):

    __tablename__ = 'bookmarks'

    id = db.Column(db.Integer, primary_key=True)
    curator_title = db.Column(db.String(200))
    rating = db.Column(db.Integer)
    description = db.Column(db.String)
    created_on = db.Column(db.DateTime, server_default=db.func.now())
    updated_on = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    user = db.relationship('User')

    is_private = db.Column(db.Boolean, nullable=True, default=False)

    work_id = db.Column(db.Integer, db.ForeignKey('works.id', ondelete='CASCADE'))
    work = db.relationship('Work', back_populates='bookmarks')

    tags = db.relationship('Tag', secondary=bookmark_tag_table,
        backref=db.backref('bookmark_tags', lazy='dynamic'), lazy='dynamic')

    comments = db.relationship('Comment', backref='comment_bookmark',
                                lazy='dynamic')

    links = db.relationship('BookmarkLink', backref='link_bookmark',
                                lazy='dynamic')

def __repr__(self):
    return '<Bookmark: {}>'.format(self.id)

class BookmarkLink(db.Model):

    __tablename__ = 'bookmark_links'

    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.String(200))
    text = db.Column(db.String(200))


    bookmark_id = db.Column(db.Integer, db.ForeignKey('bookmarks.id', ondelete='CASCADE'))
    bookmark = db.relationship('Bookmark', back_populates='links')


    def __repr__(self):
        return '<BookmarkLink: {}>'.format(self.id)


class Message(db.Model):

    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    message_subject = db.Column(db.String(200))
    message_content = db.Column(db.String)
    message_read = db.Column(db.Boolean, default=False)

    to_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    to_user = db.relationship('User', back_populates='received_messages', foreign_keys=[to_user_id])

    from_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    from_user = db.relationship('User', back_populates='sent_messages',foreign_keys=[from_user_id])

    replies = db.relationship("Message",
                        secondary=message_to_message,
                        primaryjoin=id==message_to_message.c.parent_message_id,
                        secondaryjoin=id==message_to_message.c.child_message_id,
                        backref="parent_message", lazy='dynamic'
                )

class Notification(db.Model):

    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200))
    date_created = db.Column(db.DateTime)
    route = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    user = db.relationship('User')

    notification_type_id = db.Column(db.Integer, db.ForeignKey('notification_types.id', ondelete='CASCADE'))
    notification_type = db.relationship('NotificationType')

class NotificationType(db.Model):
    __tablename__ = 'notification_types'

    id = db.Column(db.Integer, primary_key=True)
    type_label = db.Column(db.String(200))
    send_email = db.Column(db.Boolean)

    def __init__(self, type_label, send_email):
        self.type_label = type_label
        self.send_email = send_email


def __repr__(self):
    return '<Message: {}>'.format(self.id)
