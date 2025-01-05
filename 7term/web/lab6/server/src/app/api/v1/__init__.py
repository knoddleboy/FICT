from fastapi import APIRouter

from .employees import router as employees_router
from .departments import router as departments_router

router = APIRouter(prefix="/v1")
router.include_router(employees_router)
router.include_router(departments_router)
