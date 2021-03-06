"""empty message

Revision ID: db6a057f5865
Revises: 89989d88f652
Create Date: 2018-10-13 17:35:14.187055

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'db6a057f5865'
down_revision = '89989d88f652'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bookmarks', sa.Column('is_private', sa.Boolean(), nullable=True, default=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bookmarks', 'is_private')
    # ### end Alembic commands ###
