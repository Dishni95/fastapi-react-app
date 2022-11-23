import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database, models as _models, schemas as _schemas

from sqlalchemy.orm import sessionmaker, relationship, aliased
from sqlalchemy import cast, Integer, Text, Column, ForeignKey, literal, null
from sqlalchemy.sql import column, label

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(
        email=user.email, hashed_password=_hash.bcrypt.hash(user.hashed_password)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)

    token = _jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
    db: _orm.Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2schema),
):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).get(payload["id"])
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return _schemas.User.from_orm(user)

# post functions

async def create_post(user: _schemas.User, db: _orm.Session, post: _schemas.PostCreate):
    post = _models.Post(**post.dict(), owner_id=user.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return _schemas.Post.from_orm(post)


async def get_posts(user: _schemas.User, db: _orm.Session):
    posts = db.query(_models.Post).filter_by(owner_id=user.id)

    return list(map(_schemas.Post.from_orm, posts))


async def _post_selector(post_id: int, user: _schemas.User, db: _orm.Session):
    post = (
        db.query(_models.Post)
        .filter_by(owner_id=user.id)
        .filter(_models.Post.id == post_id)
        .first()
    )

    if post is None:
        raise _fastapi.HTTPException(status_code=404, detail="Post does not exist")

    return post


async def get_post(post_id: int, user: _schemas.User, db: _orm.Session):
    post = await _post_selector(post_id=post_id, user=user, db=db)

    return _schemas.Post.from_orm(post)


async def delete_post(post_id: int, user: _schemas.User, db: _orm.Session):
    post = await _post_selector(post_id, user, db)

    db.delete(post)
    db.commit()

async def update_post(post_id: int, post: _schemas.PostCreate, user: _schemas.User, db: _orm.Session):
    post_db = await _post_selector(post_id, user, db)

    post_db.post_name = post.post_name
    post_db.post_body = post.post_body
    
    
    db.commit()
    db.refresh(post_db)

    return _schemas.Post.from_orm(post_db)

#comment functions

async def create_comment(user: _schemas.User, db: _orm.Session, comment: _schemas.CommentCreate): #, post_id: int):
    comment = _models.Comment(**comment.dict(), owner_id=user.id)#, post_id=post_id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _schemas.Comment.from_orm(comment)


async def get_comments(user: _schemas.User, db: _orm.Session):
    comments = db.query(_models.Comment).filter_by(owner_id=user.id)
    comments = db.query(_models.Comment).filter_by(parent_id = None)
    #, literal(0).label('level')
    #comments = comments.cte('cte', recursive=True)
##
    #bottom = db.query(_models.Comment, (comments.level+1).label('level'))
    #bottom = bottom.join(comments, _models.Comment.parent_id == comments.c.id)
##
    #recursive_q = comments.union(bottom)
    #q = db.query(recursive_q)

    #hierarchy = db.query(
    #        _models.Comment, literal(0).label('level'))\
    #        .filter(_models.Comment.parent_id == null())\
    #        .cte(name="hierarchy", recursive=True)
    #       
    #parent = aliased(hierarchy, name="p")
    #children = aliased(_models.Comment, name="c")
    #hierarchy = hierarchy.union_all(
    #            db.query(
    #                children,
    #                (parent.c.level + 1).label("level"))
    #            .filter(children.parent_id == parent.c.id))
    #        
    #result = db.query(_models.Comment, hierarchy.c.level)\
    #        .select_entity_from(hierarchy).all()
    
    return list(map(_schemas.Comment.from_orm, comments))


async def _comment_selector(comment_id: int, user: _schemas.User, db: _orm.Session):
    comment = (
        db.query(_models.Comment)
        .filter_by(owner_id=user.id)
        .filter(_models.Comment.id == comment_id)
        .first()
    )

    if comment is None:
        raise _fastapi.HTTPException(status_code=404, detail="Post does not exist")

    return comment


async def get_comment(comment_id: int, user: _schemas.User, db: _orm.Session):
    comment = await _comment_selector(comment_id=comment_id, user=user, db=db)

    return _schemas.Comment.from_orm(comment)


async def delete_comment(comment_id: int, user: _schemas.User, db: _orm.Session):
    comment = await _comment_selector(comment_id, user, db)

    db.delete(comment)
    db.commit()

async def update_comment(comment_id: int, comment: _schemas.CommentCreate, user: _schemas.User, db: _orm.Session):
    comment_db = await _comment_selector(comment_id, user, db)

    comment_db.comment_text = comment.comment_text
    

    db.commit()
    db.refresh(comment_db)

    return _schemas.Comment.from_orm(comment_db)