import os
import uuid

import boto3
import pandas as pd
from botocore.exceptions import ClientError

from api.models.movie_dtos import MovieDTO
from api.utilities.opensearch_operations import populate_index

# Set the values
bucket_name = os.environ.get("S3_BUCKET_NAME", "")
key = "TMDB_movie_dataset_v11.csv"


def read_csv(file_name):
    for chunk in pd.read_csv(file_name, chunksize=2000):
        yield chunk


def process_csv_file(chunks):
    try:
        s3 = boto3.client("s3")
        obj = s3.get_object(Bucket=bucket_name, Key=key)
        csv_file = obj["Body"]

        for df in read_csv(csv_file):
            movies = []
            for index, row in df.iterrows():
                movie = MovieDTO(
                    id=str(uuid.uuid4()),
                    name=row["title"],
                    runtime=row["runtime"],
                    vote_average=row["vote_average"],
                    vote_count=row["vote_count"],
                    revenue=row["revenue"],
                    budget=row["budget"],
                    release_date=(
                        row["release_date"]
                        if isinstance(row["release_date"], str)
                        else None
                    ),
                    adult=row["adult"],
                    overview=(
                        row["overview"] if isinstance(row["overview"], str) else None
                    ),
                    genres=(
                        [elem.lstrip() for elem in row["genres"].split(",")]
                        if isinstance(row["genres"], str)
                        else None
                    ),
                    production_companies=(
                        [elem.lstrip() for elem in row["production_companies"].split(",")]
                        if isinstance(row["production_companies"], str)
                        else None
                    ),
                )
                movies.append(movie)
            populate_index(movies)
            chunks -= 1
            if chunks == 0:
                return
    except ClientError as ex:
        if ex.response["Error"]["Code"] == "NoSuchKey":
            print("Key doesn't match. Please check the key value entered.")
        raise ex
