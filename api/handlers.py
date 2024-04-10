import json

from api.utilities.opensearch_operations import set_result_window
from api.utilities.s3_operations import process_csv_file


def bulk_upload_handler(event, context):
    for record in event["Records"]:
        message_body = json.loads(record["body"])
        chunks = int(message_body)
        process_csv_file(chunks)

    set_result_window()

    return {
        "statusCode": 200,
        "body": json.dumps("Message processing completed successfully"),
    }
