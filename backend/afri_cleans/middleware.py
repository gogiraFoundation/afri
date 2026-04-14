"""
Production-oriented middleware for API routes.
"""

import logging

from django.conf import settings
from django.http import JsonResponse

logger = logging.getLogger(__name__)


class ApiJsonExceptionMiddleware:
    """
    Return JSON (no stack traces) for unhandled exceptions on /api/ paths when DEBUG is off.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        if settings.DEBUG or not request.path.startswith("/api/"):
            return None
        logger.exception("Unhandled exception for %s %s", request.method, request.path)
        return JsonResponse(
            {
                "code": "server_error",
                "message": "An internal server error occurred.",
            },
            status=500,
        )
