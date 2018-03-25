import datetime
import jwt

from server.flask_app import app, db, bcrypt
from sqlalchemy.ext.declarative import declarative_base

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
    """ User Model for storing user related details """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)
    comments = db.relationship('Comment', backref='comment_user',
                                lazy='dynamic')
    works = db.relationship('Work', backref='work_user',
                                lazy='dynamic')
    bookmarks = db.relationship('Bookmark', backref='bookmark_user',
                                lazy='dynamic')

    received_messages = db.relationship('Message', foreign_keys="[Message.to_user_id]",
                                lazy='dynamic')

    sent_messages = db.relationship('Message', foreign_keys="[Message.from_user_id]",
                                lazy='dynamic')

    def __init__(self, email, password, admin=False):
        self.email = email
        self.password = bcrypt.generate_password_hash(
            password, app.config.get('BCRYPT_LOG_ROUNDS')
        ).decode()
        self.registered_on = datetime.datetime.now()
        self.admin = admin

    def encode_auth_token(self, user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=5),
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
        """
        Decodes the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

class Work(db.Model):

    __tablename__ = 'works'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    work_summary = db.Column(db.String)
    work_notes = db.Column(db.String)
    is_complete = db.Column(db.Integer)
    word_count = db.Column(db.Integer)
    chapters = db.relationship('Chapter', backref='chapter_work',
                                lazy='dynamic')

    bookmarks = db.relationship('Bookmark', backref='bookmark_work',
                                lazy='dynamic')

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
    

    def __repr__(self):
        return '<WorkType: {}>'.format(self.id)

class Chapter(db.Model):

    __tablename__ = 'chapters'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    number = db.Column(db.Integer)
    text = db.Column(db.String)
    audio_url = db.Column(db.String)
    image_url = db.Column(db.String)
    image_alt_text = db.Column(db.String)
    summary = db.Column(db.String)
    comments = db.relationship('Comment', backref='comment_chapter',
                                lazy='dynamic')

    work_id = db.Column(db.Integer, db.ForeignKey('works.id'))
    work = db.relationship('Work', back_populates='chapters')

    def __repr__(self):
        return '<Chapter: {}>'.format(self.id)

class Comment(db.Model):

    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='comments')

    chapter_id = db.Column(db.Integer, db.ForeignKey('chapters.id'))
    chapter = db.relationship('Chapter', back_populates='comments')

    bookmark_id = db.Column(db.Integer, db.ForeignKey('bookmarks.id'))
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
    tag_type_id = db.Column(db.Integer, db.ForeignKey('tag_types.id'))
    tag_type = db.relationship('TagType', back_populates='tags')

    def __repr__(self):
        return '<Tag: {}>'.format(self.id)

class TagType(db.Model):

    __tablename__ = 'tag_types'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(200))
    tags = db.relationship('Tag', back_populates='tag_type')

    def __repr__(self):
        return '<TagType: {}>'.format(self.id)

class Bookmark(db.Model):

    __tablename__ = 'bookmarks'

    id = db.Column(db.Integer, primary_key=True)
    curator_title = db.Column(db.String(200))
    rating = db.Column(db.Integer)
    description = db.Column(db.String)


    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User')

    work_id = db.Column(db.Integer, db.ForeignKey('works.id'))
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


    bookmark_id = db.Column(db.Integer, db.ForeignKey('bookmarks.id'))
    bookmark = db.relationship('Bookmark', back_populates='links')


    def __repr__(self):
        return '<BookmarkLink: {}>'.format(self.id)


class Message(db.Model):

    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    message_subject = db.Column(db.String(200))
    message_content = db.Column(db.String)
    message_read = db.Column(db.Boolean, default=False)

    to_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    to_user = db.relationship('User', back_populates='received_messages', foreign_keys=[to_user_id])

    from_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    from_user = db.relationship('User', back_populates='sent_messages',foreign_keys=[from_user_id])

    replies = db.relationship("Message",
                        secondary=message_to_message,
                        primaryjoin=id==message_to_message.c.parent_message_id,
                        secondaryjoin=id==message_to_message.c.child_message_id,
                        backref="parent_message", lazy='dynamic'
                )


def __repr__(self):
    return '<Message: {}>'.format(self.id)
