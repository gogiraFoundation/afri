from django.urls import path
from .views import (
    ServiceListAPIView,
    BookingCreateAPIView,
    ContactRequestCreateAPIView,
    ActivePromotionAPIView,
    BlogPostListAPIView,
    BlogPostDetailAPIView,
)

app_name = 'core'

urlpatterns = [
    path('services/', ServiceListAPIView.as_view(), name='service-list'),
    path('bookings/', BookingCreateAPIView.as_view(), name='booking-create'),
    path('contact-requests/', ContactRequestCreateAPIView.as_view(), name='contact-request-create'),
    path('promotion/', ActivePromotionAPIView.as_view(), name='active-promotion'),
    path('blog-posts/', BlogPostListAPIView.as_view(), name='blogpost-list'),
    path('blog-posts/<slug:slug>/', BlogPostDetailAPIView.as_view(), name='blogpost-detail'),
]

