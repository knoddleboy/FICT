from fastapi import FastAPI

from .api import router
from .core.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(router=router)
