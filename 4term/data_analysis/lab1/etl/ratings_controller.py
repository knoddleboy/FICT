## NOT WORKING BECAUSE I CREATED THE TABLE BEFOREHAND :( ##

import csv

from stage_models import db, Ratings
from utils.utils import cast_or


db.connect()


with open('../data/ratings.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    next(reader)

    for row in reader:

        if (len(row) < 4):
            continue

        row_data = {
            "user_id": cast_or(row[0], int),
            "movie_id": cast_or(row[1], int),
            "rating": cast_or(row[2], float),
            "rate_date": cast_or(row[3], str)
        }

        Ratings.create(**row_data)


db.close()
