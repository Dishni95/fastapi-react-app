from typing import List
import fastapi as _fastapi
import fastapi.security as _security

import sqlalchemy.orm as _orm

import services as _services, schemas as _schemas

app = _fastapi.FastAPI()


@app.post("/api/users")
async def create_user(
    user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await _services.create_user(user, db)

    return await _services.create_token(user)


@app.post("/api/token")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user


@app.get("/api")
async def root():
    return {"message": "My Blog"}

# add Post path objects

@app.post("/api/posts", response_model=_schemas.Post)
async def create_post(
    post: _schemas.PostCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_post(user=user, db=db, post=post)


@app.get("/api/posts", response_model=List[_schemas.Post])
async def get_posts(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_posts(user=user, db=db)


@app.get("/api/posts/{post_id}", status_code=200)
async def get_post(
    post_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_post(post_id, user, db)


@app.delete("/api/posts/{post_id}", status_code=204)
async def delete_post(
    post_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.delete_post(post_id, user, db)
    return {"message", "Successfully Deleted"}


@app.put("/api/posts/{post_id}", status_code=200)
async def update_post(
    post_id: int,
    post: _schemas.PostCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.update_post(post_id, post, user, db)
    return {"message", "Successfully Updated"}


# Comment path objects functions

@app.post("/api/comments", response_model=_schemas.Comment)
async def create_comment(
    #post_id: int,
    comment: _schemas.CommentCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_comment(user=user, db=db, comment=comment)#, post_id=post_id)


@app.get("/api/comments", response_model=List[_schemas.Comment])
async def get_comments(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_comments(user=user, db=db)


@app.get("/api/comments/{comment_id}", status_code=200)
async def get_comment(
    comment_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_comment(comment_id, user, db)


@app.delete("/api/comments/{comment_id}", status_code=204)
async def delete_comment(
    comment_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.delete_comment(comment_id, user, db)
    return {"message", "Successfully Deleted"}


@app.put("/api/comments/{comment_id}", status_code=200)
async def update_comment(
    comment_id: int,
    comment: _schemas.CommentCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.update_comment(comment_id, comment, user, db)
    return {"message", "Successfully Updated"}