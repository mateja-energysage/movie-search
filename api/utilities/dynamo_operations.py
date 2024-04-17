import datetime
import json
import logging
import uuid
from decimal import Decimal
from os import environ
from typing import Any, Dict

import boto3
from boto3.dynamodb import types
from fastapi import HTTPException


def get_dynamo_client() -> Any:
    return boto3.client(
        "dynamodb",
        region_name=environ.get("AWS_REGION"),
        aws_access_key_id=environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=environ.get("AWS_SECRET_ACCESS_KEY"),
        aws_session_token=environ.get("AWS_SESSION_TOKEN"),
    )


def replace_decimals(obj: Any) -> Any:
    if isinstance(obj, list):
        for i in range(len(obj)):
            obj[i] = replace_decimals(obj[i])
        return obj
    elif isinstance(obj, dict):
        for k in obj.keys():
            obj[k] = replace_decimals(obj[k])
        return obj
    elif isinstance(obj, Decimal):
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    else:
        return obj


class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime.datetime):
            return o.isoformat()
        if isinstance(o, uuid.UUID):
            return str(o)
        return json.JSONEncoder.default(self, o)


def transform_dynamo_response(item: Dict[Any, Any]) -> Dict[Any, Any]:
    response = {}
    deserializer = types.TypeDeserializer()
    for field in item.keys():
        response[field] = replace_decimals(deserializer.deserialize(item[field]))
    return response


def serialize_from_dict_to_dynamodb_item(item: Dict[Any, Any]) -> Any:
    serializer = types.TypeSerializer()
    parsed_object = json.loads(
        json.dumps(item, cls=DateTimeEncoder), parse_float=Decimal
    )

    item = {}
    for field in parsed_object.keys():
        item[field] = serializer.serialize(parsed_object[field])
    return item


def put_item_into_table(item: Any) -> Any:
    dynamodb = get_dynamo_client()
    item["id"] = uuid.uuid4()
    try:
        response = dynamodb.put_item(
            Item=serialize_from_dict_to_dynamodb_item(item),
            ReturnConsumedCapacity="TOTAL",
            TableName=environ.get("USER_TABLE_NAME"),
        )
        return response
    except Exception as e:
        logging.error(e, exc_info=True)
        raise HTTPException(status_code=500, detail="Insert into Dynamo failed")


def get_item_by_pk(pk: str) -> Any:
    client = get_dynamo_client()
    response = client.get_item(
        TableName=environ.get("USER_TABLE_NAME"),
        Key={
            "username": {"S": pk},
        },
    )
    if "Item" not in response:
        return None
    return transform_dynamo_response(response["Item"])
