"""4th revision

Revision ID: a3736372ee69
Revises: 477a22064d23
Create Date: 2022-09-08 12:10:03.006371

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a3736372ee69'
down_revision = '477a22064d23'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('posts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('post_name', sa.String(), nullable=True),
    sa.Column('post_body', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_posts_id'), 'posts', ['id'], unique=False)
    op.create_index(op.f('ix_posts_post_body'), 'posts', ['post_body'], unique=False)
    op.create_index(op.f('ix_posts_post_name'), 'posts', ['post_name'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_posts_post_name'), table_name='posts')
    op.drop_index(op.f('ix_posts_post_body'), table_name='posts')
    op.drop_index(op.f('ix_posts_id'), table_name='posts')
    op.drop_table('posts')
    # ### end Alembic commands ###
