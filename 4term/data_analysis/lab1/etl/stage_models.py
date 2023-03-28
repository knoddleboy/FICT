from peewee import *


db = PostgresqlDatabase(
    'dwh',
    user='',
    password='',
    host='localhost',
    port=5432
)


class BaseModel(Model):
    class Meta:
        database = db
        schema = "stage"


class MoviesMetadata(BaseModel):
    adult = BooleanField()
    belongs_to_collection = TextField()
    budget = IntegerField()
    genres = TextField()
    homepage = TextField()
    id = IntegerField()
    imdb_id = CharField(max_length=9)
    original_language = CharField(max_length=2)
    original_title = TextField()
    overview = TextField()
    popularity = TextField()
    poster_path = CharField(max_length=32)
    production_companies = TextField()
    production_countries = TextField()
    release_date = DateField()
    revenue = BigIntegerField()
    runtime = DecimalField(max_digits=5, decimal_places=1)
    spoken_languages = TextField()
    status = CharField(max_length=60)
    tagline = TextField()
    title = TextField()
    video = BooleanField()
    vote_average = DecimalField(max_digits=3, decimal_places=1)
    vote_count = IntegerField()

    class Meta:
        table_name = "movies_metadata"


class Credits(BaseModel):
    id = IntegerField()
    cast = TextField()
    crew = TextField()

    class Meta:
        table_name = "credits"


## NOT WORKING ##
class Ratings(BaseModel):
    user_id = IntegerField()
    movie_id = IntegerField()
    rating = DecimalField(max_digits=2, decimal_places=1)
    rate_date = TextField()

    class Meta:
        table_name = "ratings"
