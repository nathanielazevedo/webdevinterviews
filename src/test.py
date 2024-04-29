from django.http import HttpResponse
from jwcrypto import jwt, jwk
import requests


def validate_access_token(request):
    # Obtain the access token from the Authorization header
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        # Token not provided, return unauthorized response
        return HttpResponse(status=401)

    token = authorization_header.split(" ")[
        1
    ]  # Extract the token (assuming 'Bearer' scheme)

    # Fetch the public keys from Azure AD's signing keys endpoint
    keys_endpoint = "https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys"
    response = requests.get(keys_endpoint)
    keys = response.json()["keys"]

    # Find the public key matching the Key ID (kid) in the token header
    token_header = jwt.JWT(jwt=token).headers
    matching_key = next(
        (key for key in keys if key["kid"] == token_header["kid"]), None
    )
    if not matching_key:
        # Key not found, return unauthorized response
        return HttpResponse(status=401)

    # Convert the matching key to JWK format
    jwk_key = jwk.JWK(**matching_key)

    # Verify the token's signature using the matching public key
    try:
        token = jwt.JWT(jwt=token, key=jwk_key)
        token.claims  # This step performs the verification
    except jwt.JWTError:
        # Signature verification failed, return unauthorized response
        return HttpResponse(status=401)

    # Token signature verified, now validate token claims
    # Add additional validation checks as needed

    # Token is valid, proceed with your Django application logic
    # Example: Extract user's email from token claims
    user_email = token.claims.get("email")

    # Example: Return success response
    return HttpResponse(status=200)
