import datetime as _dt
from tkinter import CASCADE

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database


class User(_database.Base):
    __tablename__ = "users"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    email = _sql.Column(_sql.String, unique=True, index=True)
    hashed_password = _sql.Column(_sql.String)

    leads = _orm.relationship("Lead", back_populates="owner")
    posts = _orm.relationship("Post", back_populates="owner")
    comments = _orm.relationship("Comment", back_populates="user")

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)


class Lead(_database.Base):
    __tablename__ = "leads"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    owner_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    first_name = _sql.Column(_sql.String, index=True)
    last_name = _sql.Column(_sql.String, index=True)
    email = _sql.Column(_sql.String, index=True)
    company = _sql.Column(_sql.String, index=True, default="")
    note = _sql.Column(_sql.String, default="")
    date_created = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)
    date_last_updated = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)

    owner = _orm.relationship("User", back_populates="leads")

class Post(_database.Base):
    __tablename__ = "posts"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    owner_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    post_name = _sql.Column(_sql.String, index=True)
    post_body = _sql.Column(_sql.Text, index=True)

    owner = _orm.relationship("User", back_populates="posts")
    comments = _orm.relationship("Comment", back_populates="posts")

class Comment(_database.Base):
    __tablename__ = "comments"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    post_id = _sql.Column(_sql.Integer, _sql.ForeignKey("posts.id", ondelete='CASCADE'))
    owner_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id", ondelete='CASCADE'))
    comment_text = _sql.Column(_sql.Text, index=True)
    parent_id = _sql.Column(_sql.Integer, _sql.ForeignKey("comments.id"), nullable=True)

    posts = _orm.relationship("Post", back_populates="comments")
    user = _orm.relationship("User", back_populates="comments")
    replies = _orm.relationship("Comment", backref=_orm.backref('parent', remote_side = [id]))
