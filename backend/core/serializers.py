from rest_framework import serializers
from .models import Service, Booking, ContactRequest, Promotion, Invoice, BlogPost
from .utils import calculate_booking_pricing, get_vat_config_payload


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'slug', 'short_description', 'long_description', 
                  'is_active', 'display_order', 'price_from']
        read_only_fields = ['id']


class BookingSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    vat_config = serializers.SerializerMethodField()

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
            'vat_config',
            'status',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'status',
            'created_at',
            'estimated_price',
            'subtotal',
            'vat_amount',
            'total_with_vat',
            'vat_config',
        ]

    def get_vat_config(self, obj):
        return get_vat_config_payload()

    def validate_preferred_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("Preferred date cannot be in the past.")
        return value

    def create(self, validated_data):
        """Automatically calculate an estimated quote, apply promo discount, and calculate VAT."""
        service = validated_data.get('service')
        pricing = calculate_booking_pricing(
            service_price_from=getattr(service, 'price_from', None),
            billing_type=validated_data.get('billing_type', 'fixed'),
            estimated_hours=validated_data.get('estimated_hours'),
            promo_code=validated_data.get('promo_code', ''),
            promo_discount=validated_data.get('promo_discount'),
        )

        validated_data['estimated_price'] = pricing['base_price']
        validated_data['subtotal'] = pricing['subtotal']
        validated_data['vat_amount'] = pricing['vat_amount']
        validated_data['total_with_vat'] = pricing['total']

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

