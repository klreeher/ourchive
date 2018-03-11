"""empty message

Revision ID: 781f2864ec89
Revises: 6f2102d97993
Create Date: 2018-03-11 14:45:39.322914

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '781f2864ec89'
down_revision = '6f2102d97993'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('message_subject', sa.String(length=200), nullable=True),
    sa.Column('message_content', sa.String(), nullable=True),
    sa.Column('message_read', sa.Boolean(), nullable=True),
    sa.Column('to_user_id', sa.Integer(), nullable=True),
    sa.Column('from_user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['from_user_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['to_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('message_to_message',
    sa.Column('parent_message_id', sa.Integer(), nullable=False),
    sa.Column('child_message_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['child_message_id'], ['messages.id'], ),
    sa.ForeignKeyConstraint(['parent_message_id'], ['messages.id'], ),
    sa.PrimaryKeyConstraint('parent_message_id', 'child_message_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('message_to_message')
    op.drop_table('messages')
    # ### end Alembic commands ###
