"""8th revision

Revision ID: af2b1acb0f76
Revises: 7c19ef896ce4
Create Date: 2022-09-12 16:47:47.556944

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'af2b1acb0f76'
down_revision = '7c19ef896ce4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('comments_owner_id_fkey', 'comments', type_='foreignkey')
    op.drop_constraint('comments_post_id_fkey', 'comments', type_='foreignkey')
    op.create_foreign_key(None, 'comments', 'users', ['owner_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'comments', 'posts', ['post_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.create_foreign_key('comments_post_id_fkey', 'comments', 'posts', ['post_id'], ['id'])
    op.create_foreign_key('comments_owner_id_fkey', 'comments', 'users', ['owner_id'], ['id'])
    # ### end Alembic commands ###