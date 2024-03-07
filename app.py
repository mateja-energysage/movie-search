#!/usr/bin/env python3

import aws_cdk as cdk

from movie_search.movie_search_stack import MovieSearchStack


app = cdk.App()
MovieSearchStack(app, "movie-search")

app.synth()
