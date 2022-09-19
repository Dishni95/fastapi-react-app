import datetime as _dt
from matplotlib.pyplot import text
from typing import Union, List

import pydantic as _pydantic


class _UserBase(_pydantic.BaseModel):
    email: str


class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(_UserBase):
    id: int

    class Config:
        orm_mode = True


class _LeadBase(_pydantic.BaseModel):
    first_name: str
    last_name: str
    email: str
    company: str
    note: str


class LeadCreate(_LeadBase):
    pass


class Lead(_LeadBase):
    id: int
    owner_id: int
    date_created: _dt.datetime
    date_last_updated: _dt.datetime

    class Config:
        orm_mode = True


class _PostBase(_pydantic.BaseModel):
    post_name: str
    post_body: str

class PostCreate(_PostBase):
    pass

class Post(_PostBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class _CommentBase(_pydantic.BaseModel):
    comment_text: str
    post_id: int
    

class CommentCreate(_CommentBase):
    pass

class Comment(_CommentBase):
    id: int
    owner_id: int
    
    parent_id: Union[int, None] = None
    

    class Config:
        orm_mode = True