"""empty message

Revision ID: bcce035c4d07
Revises: f1fabccfa03d
Create Date: 2018-03-10 12:18:08.413852

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bcce035c4d07'
down_revision = 'f1fabccfa03d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('bookmark_comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('bookmark_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['bookmark_id'], ['bookmarks.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_constraint('comments_bookmark_id_fkey', 'comments', type_='foreignkey')
    op.drop_column('comments', 'bookmark_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comments', sa.Column('bookmark_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('comments_bookmark_id_fkey', 'comments', 'bookmarks', ['bookmark_id'], ['id'])
    op.drop_table('bookmark_comments')
    # ### end Alembic commands ###