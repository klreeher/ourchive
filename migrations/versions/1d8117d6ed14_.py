"""empty message

Revision ID: 1d8117d6ed14
Revises: adc3e14da436
Create Date: 2018-03-22 20:30:51.000419

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1d8117d6ed14'
down_revision = 'adc3e14da436'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('work_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type_name', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('works', sa.Column('type_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'works', 'work_types', ['type_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'works', type_='foreignkey')
    op.drop_column('works', 'type_id')
    op.drop_table('work_types')
    # ### end Alembic commands ###
