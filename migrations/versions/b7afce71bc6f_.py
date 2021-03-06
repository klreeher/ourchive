"""empty message

Revision ID: b7afce71bc6f
Revises: 28c51d215b39
Create Date: 2018-04-14 22:47:36.817118

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7afce71bc6f'
down_revision = '28c51d215b39'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('bookmark_links_bookmark_id_fkey', 'bookmark_links', type_='foreignkey')
    op.create_foreign_key(None, 'bookmark_links', 'bookmarks', ['bookmark_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('bookmarks_user_id_fkey', 'bookmarks', type_='foreignkey')
    op.drop_constraint('bookmarks_work_id_fkey', 'bookmarks', type_='foreignkey')
    op.create_foreign_key(None, 'bookmarks', 'works', ['work_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'bookmarks', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('chapters_work_id_fkey', 'chapters', type_='foreignkey')
    op.create_foreign_key(None, 'chapters', 'works', ['work_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('comments_chapter_id_fkey', 'comments', type_='foreignkey')
    op.drop_constraint('comments_bookmark_id_fkey', 'comments', type_='foreignkey')
    op.drop_constraint('comments_user_id_fkey', 'comments', type_='foreignkey')
    op.create_foreign_key(None, 'comments', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'comments', 'bookmarks', ['bookmark_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'comments', 'chapters', ['chapter_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('messages_from_user_id_fkey', 'messages', type_='foreignkey')
    op.drop_constraint('messages_to_user_id_fkey', 'messages', type_='foreignkey')
    op.create_foreign_key(None, 'messages', 'users', ['to_user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'messages', 'users', ['from_user_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('notifications_notification_type_id_fkey', 'notifications', type_='foreignkey')
    op.create_foreign_key(None, 'notifications', 'notification_types', ['notification_type_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint('tags_tag_type_id_fkey', 'tags', type_='foreignkey')
    op.create_foreign_key(None, 'tags', 'tag_types', ['tag_type_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'tags', type_='foreignkey')
    op.create_foreign_key('tags_tag_type_id_fkey', 'tags', 'tag_types', ['tag_type_id'], ['id'])
    op.drop_constraint(None, 'notifications', type_='foreignkey')
    op.create_foreign_key('notifications_notification_type_id_fkey', 'notifications', 'notification_types', ['notification_type_id'], ['id'])
    op.drop_constraint(None, 'messages', type_='foreignkey')
    op.drop_constraint(None, 'messages', type_='foreignkey')
    op.create_foreign_key('messages_to_user_id_fkey', 'messages', 'users', ['to_user_id'], ['id'])
    op.create_foreign_key('messages_from_user_id_fkey', 'messages', 'users', ['from_user_id'], ['id'])
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.create_foreign_key('comments_user_id_fkey', 'comments', 'users', ['user_id'], ['id'])
    op.create_foreign_key('comments_bookmark_id_fkey', 'comments', 'bookmarks', ['bookmark_id'], ['id'])
    op.create_foreign_key('comments_chapter_id_fkey', 'comments', 'chapters', ['chapter_id'], ['id'])
    op.drop_constraint(None, 'chapters', type_='foreignkey')
    op.create_foreign_key('chapters_work_id_fkey', 'chapters', 'works', ['work_id'], ['id'], ondelete='SET NULL')
    op.drop_constraint(None, 'bookmarks', type_='foreignkey')
    op.drop_constraint(None, 'bookmarks', type_='foreignkey')
    op.create_foreign_key('bookmarks_work_id_fkey', 'bookmarks', 'works', ['work_id'], ['id'])
    op.create_foreign_key('bookmarks_user_id_fkey', 'bookmarks', 'users', ['user_id'], ['id'])
    op.drop_constraint(None, 'bookmark_links', type_='foreignkey')
    op.create_foreign_key('bookmark_links_bookmark_id_fkey', 'bookmark_links', 'bookmarks', ['bookmark_id'], ['id'])
    # ### end Alembic commands ###
