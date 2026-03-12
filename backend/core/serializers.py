from rest_framework import serializers
from django.conf import settings
from .models import Service, Booking, ContactRequest, Promotion, Invoice, BlogPost


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'slug', 'short_description', 'long_description', 
                  'is_active', 'display_order', 'price_from']
        read_only_fields = ['id']


class BookingSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'service',
            'service_name',
            'job_type',
            'billing_type',
            'preferred_date',
            'preferred_time_window',
            'address',
            'notes',
            'estimated_hours',
            'estimated_price',
            'promo_code',
            'promo_discount',
            'subtotal',
            'vat_amount',
            'total_with_vat',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'estimated_price', 'subtotal', 'vat_amount', 'total_with_vat']

    def validate_preferred_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("Preferred date cannot be in the past.")
        return value

    def create(self, validated_data):
        """Automatically calculate an estimated quote, apply promo discount, and calculate VAT."""
        from decimal import Decimal
        
        service = validated_data.get('service')
        billing_type = validated_data.get('billing_type')
        estimated_hours = validated_data.get('estimated_hours')
        promo_code = validated_data.get('promo_code', '')
        promo_discount = validated_data.get('promo_discount')

        # Calculate base price
        base_price = Decimal('0.00')
        if service and service.price_from is not None:
            base_price = Decimal(str(service.price_from))
            if billing_type == 'hourly' and estimated_hours:
                base_price = base_price * Decimal(str(estimated_hours))

        # Apply promotional discount if provided
        subtotal = base_price
        if promo_code and promo_discount:
            discount_amount = subtotal * (Decimal(str(promo_discount)) / Decimal('100'))
            subtotal = subtotal - discount_amount

        validated_data['estimated_price'] = base_price
        validated_data['subtotal'] = subtotal

        # Calculate VAT if enabled
        if getattr(settings, 'APPLY_VAT_BY_DEFAULT', True):
            vat_rate = Decimal(str(getattr(settings, 'DEFAULT_VAT_RATE', 0.15)))
            vat_amount = subtotal * vat_rate
            total_with_vat = subtotal + vat_amount
            validated_data['vat_amount'] = vat_amount
            validated_data['total_with_vat'] = total_with_vat
        else:
            validated_data['vat_amount'] = Decimal('0.00')
            validated_data['total_with_vat'] = subtotal

        return super().create(validated_data)


class PromotionSerializer(serializers.ModelSerializer):
    is_currently_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Promotion
        fields = [
            'id',
            'title',
            'subtitle',
            'badge_text',
            'discount_percentage',
            'promo_code',
            'is_active',
            'is_currently_active',
            'start_date',
            'end_date',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class InvoiceSerializer(serializers.ModelSerializer):
    booking_name = serializers.CharField(source='booking.name', read_only=True)
    booking_email = serializers.EmailField(source='booking.email', read_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id',
            'invoice_number',
            'booking',
            'booking_name',
            'booking_email',
            'issue_date',
            'due_date',
            'description',
            'subtotal',
            'vat_amount',
            'total',
            'status',
            'sent_to_email',
            'sent_at',
            'created_at',
        ]
        read_only_fields = ['id', 'invoice_number', 'created_at', 'sent_at']


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = ['id', 'name', 'email', 'phone', 'message', 'handled', 'created_at']
        read_only_fields = ['id', 'handled', 'created_at']


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'content',
            'seo_title',
            'seo_description',
            'is_published',
            'published_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'published_at']

