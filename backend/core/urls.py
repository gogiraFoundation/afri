from django.urls import path
from .views import (
    ServiceListAPIView,
    BookingCreateAPIView,
    ContactRequestCreateAPIView,
    ActivePromotionAPIView,
    HealthCheckAPIView,
    VATConfigAPIView,
    BlogPostListAPIView,
    BlogPostDetailAPIView,
)

app_name = 'core'

urlpatterns = [
    path('health/', HealthCheckAPIView.as_view(), name='health'),
    path('services/', ServiceListAPIView.as_view(), name='service-list'),
    path('bookings/', BookingCreateAPIView.as_view(), name='booking-create'),
    path('contact-requests/', ContactRequestCreateAPIView.as_view(), name='contact-request-create'),
    path('promotion/', ActivePromotionAPIView.as_view(), name='active-promotion'),
    path('vat-config/', VATConfigAPIView.as_view(), name='vat-config'),
    path('blog-posts/', BlogPostListAPIView.as_view(), name='blogpost-list'),
    path('blog-posts/<slug:slug>/', BlogPostDetailAPIView.as_view(), name='blogpost-detail'),
]

