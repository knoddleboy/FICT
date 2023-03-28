from typing import Any, Type
from datetime import datetime, timezone
import json
import ast


def cast_or(o: Any, t: Type):
    if o == "":
        return None

    try:
        return t(o)
    except:
        return None


def to_json(s: str):
    evaled = cast_or(s, ast.literal_eval)
    return cast_or(evaled, json.dumps) if evaled != None else None


def to_timestamp(s: str):
    timestamp_int = cast_or(s, int)

    if timestamp_int == None:
        return None

    return datetime.fromtimestamp(timestamp_int, timezone.utc)
