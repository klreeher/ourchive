"""empty message

Revision ID: adc3e14da436
Revises: 781f2864ec89
Create Date: 2018-03-18 11:10:50.975493

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'adc3e14da436'
down_revision = '781f2864ec89'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('chapters', sa.Column('image_alt_text', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('chapters', 'image_alt_text')
    # ### end Alembic commands ###