# https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
import os
import urllib3
import logging
import json

logging.getLogger().setLevel(logging.INFO)

def lambda_handler(event, context) :
    client_error_message = "An error occurred while registering. Try again later."

    if not event['request']['validationData'] :
        logging.error("Missing validation data")
        raise Exception(client_error_message)

    payload = {
        'secret'   : os.environ['recaptcha_secret_key'],
        'response' : event['request']['validationData']['recaptchaToken'],
        'remoteip' : '',
    }

    try :
        http = urllib3.PoolManager()
        resp = http.request(
            'POST',
            'https://www.google.com/recaptcha/api/siteverify',
            fields = payload,
        )

        resp_data = json.loads(resp.data.decode('utf-8'))

        logging.info(resp.status)
        logging.info(resp_data)

    except Exception as e :
        logging.error(e)
        raise Exception(client_error_message)

    if resp_data['success'] :
        event['response']['autoConfirmUser'] = True
        return(event)
    else :
        raise Exception(client_error_message)
        