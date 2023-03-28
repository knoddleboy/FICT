import csv
from datetime import datetime

from stage_models import db, MoviesMetadata
from utils.utils import cast_or, to_json


db.connect()


with open('../data/movies_metadata.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    next(reader)

    for row in reader:

        if (len(row) < 24):
            continue

        row_data = {
            "adult": cast_or(row[0], eval),
            "belongs_to_collection": to_json(row[1]),
            "budget": cast_or(row[2], int),
            "genres": to_json(row[3]),
            "homepage": cast_or(row[4], str),
            "id": cast_or(row[5], int),
            "imdb_id": cast_or(row[6], str),
            "original_language": cast_or(row[7], str),
            "original_title": cast_or(row[8], str),
            "overview": cast_or(row[9], str),
            "popularity": cast_or(row[10], str),
            "poster_path": cast_or(row[11], str),
            "production_companies": to_json(row[12]),
            "production_countries": to_json(row[13]),
            "release_date": datetime.strptime(row[14], '%Y-%m-%d').date() if row[14] != "" else None,
            "revenue": cast_or(row[15], int),
            "runtime": cast_or(row[16], float),
            "spoken_languages": to_json(row[17]),
            "status": cast_or(row[18], str),
            "tagline": cast_or(row[19], str),
            "title": cast_or(row[20], str),
            "video": cast_or(row[21], bool),
            "vote_average": cast_or(row[22], float),
            "vote_count": cast_or(row[23], int)
        }

        MoviesMetadata.create(**row_data)

db.close()
