from typing import Any, Dict

from django.conf import settings
from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


def custom_exception_handler(exc: Exception, context: Dict[str, Any]) -> Response | None:
    """
    Wrap DRF's default exception handler to return a consistent JSON error shape
    for API endpoints, without leaking internal details to clients.
    """
    # Normalize Django Http404 into DRF's NotFound so APIs get JSON 404s.
    if isinstance(exc, Http404):
        exc = NotFound()

    response = drf_exception_handler(exc, context)

    # If DRF couldn't handle it, fall back to default behaviour (e.g. 500 HTML)
    if response is None:
        return None

    status_code = response.status_code

    if status_code == status.HTTP_404_NOT_FOUND:
        code = "not_found"
        message = "Resource not found."
    elif status_code == status.HTTP_400_BAD_REQUEST:
        code = "bad_request"
        message = "Request validation failed."
    elif status_code == status.HTTP_401_UNAUTHORIZED:
        code = "unauthorized"
        message = "Authentication credentials were not provided or are invalid."
    elif status_code == status.HTTP_403_FORBIDDEN:
        code = "forbidden"
        message = "You do not have permission to perform this action."
    elif status_code >= status.HTTP_500_INTERNAL_SERVER_ERROR:
        code = "server_error"
        message = "An internal server error occurred."
    else:
        code = "error"
        # Use DRF's default reason phrase if available
        message = getattr(response, "status_text", "") or "Request failed."

    data = response.data

    # Preserve original error details in a nested structure for clients who need them.
    if isinstance(data, dict):
        details: Dict[str, Any] = data
    else:
        details = {"detail": data}

    payload: Dict[str, Any] = {
        "code": code,
        "message": message,
    }

    # In production, avoid leaking validation internals or exception payloads on 5xx responses.
    if status_code < status.HTTP_500_INTERNAL_SERVER_ERROR:
        payload["details"] = details
    elif settings.DEBUG:
        payload["details"] = details

    response.data = payload

    return response

