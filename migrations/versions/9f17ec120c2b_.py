"""empty message

Revision ID: 9f17ec120c2b
Revises: 493466ec9210
Create Date: 2018-04-17 20:41:17.155314

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9f17ec120c2b'
down_revision = '493466ec9210'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bookmarks', sa.Column('created_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
    op.add_column('bookmarks', sa.Column('updated_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bookmarks', 'updated_on')
    op.drop_column('bookmarks', 'created_on')
    # ### end Alembic commands ###
