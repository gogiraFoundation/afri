from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from .models import Service, Booking, ContactRequest, Promotion, BlogPost
from .serializers import (
    ServiceSerializer,
    BookingSerializer,
    ContactRequestSerializer,
    PromotionSerializer,
    BlogPostSerializer,
)
from .utils import send_booking_notification, send_contact_notification


class ServiceListAPIView(generics.ListAPIView):
    """List all active services"""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    pagination_class = None


class BookingCreateAPIView(generics.CreateAPIView):
    """Create a new booking request"""
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        # Send email notification
        try:
            send_booking_notification(booking)
        except Exception as e:
            # Log error but don't fail the request
            print(f"Failed to send booking notification: {e}")

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact_request = serializer.save()

        # Send email notification
        try:
            send_contact_notification(contact_request)
        except Exception as e:
            # Log error but don't fail the request
            print(f"Failed to send contact notification: {e}")

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class ActivePromotionAPIView(APIView):
    """Get the currently active promotion"""
    def get(self, request):
        promotion = Promotion.objects.filter(is_active=True).first()
        if promotion and promotion.is_currently_active():
            serializer = PromotionSerializer(promotion)
            return Response(serializer.data)
        return Response({'detail': 'No active promotion'}, status=status.HTTP_404_NOT_FOUND)


class BlogPostListAPIView(generics.ListAPIView):
    """List published blog posts for the marketing site"""

    serializer_class = BlogPostSerializer
    pagination_class = None

    def get_queryset(self):
        # Prefer published posts; if none exist yet, fall back to the
        # first 5 posts (e.g., drafts) so the homepage can still show titles.
        published = BlogPost.objects.filter(is_published=True).order_by('-published_at', '-created_at')
        if published.exists():
          return published[:5]

        return BlogPost.objects.all().order_by('-created_at')[:5]


class BlogPostDetailAPIView(generics.RetrieveAPIView):
    """Retrieve a single blog post by slug"""

    serializer_class = BlogPostSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return BlogPost.objects.filter(is_published=True)
