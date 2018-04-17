"""empty message

Revision ID: c8c45b89199e
Revises: 215d36f45c72
Create Date: 2018-04-05 20:11:25.771488

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c8c45b89199e'
down_revision = '215d36f45c72'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('notification_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type_label', sa.String(length=200), nullable=True),
    sa.Column('send_email', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('notifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('content', sa.String(length=200), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('route', sa.String(), nullable=True),
    sa.Column('notification_type_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['notification_type_id'], ['notification_types.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('notifications')
    op.drop_table('notification_types')
    # ### end Alembic commands ###