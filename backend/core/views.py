import json

from django.http import HttpResponse
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, ScopedRateThrottle, UserRateThrottle
from rest_framework.views import APIView
from django.core.mail import send_mail
import logging
from .models import Service, Booking, ContactRequest, Promotion, BlogPost
from .serializers import (
    ServiceSerializer,
    BookingSerializer,
    ContactRequestSerializer,
    PromotionSerializer,
    BlogPostSerializer,
)
from .utils import send_booking_notification, send_contact_notification, get_vat_config_payload


logger = logging.getLogger(__name__)


class ServiceListAPIView(generics.ListAPIView):
    """List all active services"""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]


class BookingCreateAPIView(generics.CreateAPIView):
    """Create a new booking request"""
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle, UserRateThrottle, ScopedRateThrottle]
    throttle_scope = 'booking_create'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        # Send email notification
        try:
            send_booking_notification(booking)
        except Exception as e:
            # Log error without exposing sensitive booking contents
            logger.exception("Failed to send booking notification for booking_id=%s", booking.id)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class ContactRequestCreateAPIView(generics.CreateAPIView):
    """Create a new contact request"""
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle, UserRateThrottle, ScopedRateThrottle]
    throttle_scope = 'contact_create'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact_request = serializer.save()

        # Send email notification
        try:
            send_contact_notification(contact_request)
        except Exception as e:
            # Log error without exposing full contact payload
            logger.exception(
                "Failed to send contact notification for contact_request_id=%s",
                contact_request.id,
            )

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class ActivePromotionAPIView(APIView):
    """Get the currently active promotion"""
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        promotion = Promotion.objects.filter(is_active=True).first()
        if promotion and promotion.is_currently_active():
            serializer = PromotionSerializer(promotion)
            return Response(serializer.data)
        # 200 + JSON null avoids 404 log noise on every page load when no promo exists.
        # Use HttpResponse so the body is literal `null` with Content-Type (DRF Response(None)
        # can omit Content-Type in some setups, breaking response.json() in tests/clients).
        return HttpResponse(
            json.dumps(None),
            content_type='application/json; charset=utf-8',
            status=status.HTTP_200_OK,
        )


class HealthCheckAPIView(APIView):
    """Liveness probe for load balancers and Docker HEALTHCHECK."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": "ok"})


class VATConfigAPIView(APIView):
    """Expose active VAT/tax configuration for frontend quote consistency."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(get_vat_config_payload())


class BlogPostListAPIView(generics.ListAPIView):
    """List published blog posts for the marketing site"""

    serializer_class = BlogPostSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return (
            BlogPost.objects.filter(is_published=True)
            .order_by('-published_at', '-created_at')[:5]
        )


class BlogPostDetailAPIView(generics.RetrieveAPIView):
    """Retrieve a single blog post by slug"""

    serializer_class = BlogPostSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return BlogPost.objects.filter(is_published=True)
