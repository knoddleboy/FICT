from fastapi import HTTPException


class BadRequestError(HTTPException):
    def __init__(self, detail: str = None) -> None:
        super().__init__(status_code=400, detail=detail)


class NotFoundException(HTTPException):
    def __init__(self, detail: str = None) -> None:
        super().__init__(status_code=404, detail=detail)


class DuplicateValueException(HTTPException):
    def __init__(self, detail: str = None) -> None:
        super().__init__(status_code=409, detail=detail)


class InternalServerException(HTTPException):
    def __init__(self, detail: str = None) -> None:
        super().__init__(status_code=500, detail=detail)
