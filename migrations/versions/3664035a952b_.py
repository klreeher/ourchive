"""empty message

Revision ID: 3664035a952b
Revises: fffeae1bb48c
Create Date: 2018-03-03 19:05:41.907675

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3664035a952b'
down_revision = 'fffeae1bb48c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('work_tag_table',
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.Column('work_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ),
    sa.ForeignKeyConstraint(['work_id'], ['works.id'], ),
    sa.PrimaryKeyConstraint('tag_id', 'work_id')
    )
    op.add_column('users', sa.Column('username', sa.String(length=255), nullable=True))
    op.create_unique_constraint(None, 'users', ['username'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_column('users', 'username')
    op.drop_table('work_tag_table')
    # ### end Alembic commands ###
