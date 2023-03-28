import csv

from stage_models import db, Credits
from utils.utils import cast_or, to_json


db.connect()


with open('../data/credits.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    next(reader)

    for row in reader:

        if (len(row) < 3):
            continue

        row_data = {
            "cast": to_json(row[0]),
            "crew": to_json(row[1]),
            "id": cast_or(row[2], int)
        }

        Credits.create(**row_data)

db.close()
