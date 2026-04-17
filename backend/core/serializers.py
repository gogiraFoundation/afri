from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.utils import timezone
from rest_framework import serializers
from .models import Service, Booking, ContactRequest, Promotion, Invoice, BlogPost
from .utils import (
    calculate_booking_pricing,
    get_vat_config_payload,
    verify_recaptcha_token,
)


def _client_ip_for_captcha(request):
    """Client IP for reCAPTCHA siteverify ``remoteip`` (and similar).

    Uses the first hop in ``X-Forwarded-For`` when present, else ``REMOTE_ADDR``.
    That first XFF hop is only trustworthy if the edge proxy overwrites or
    correctly appends the real client; see DEPLOY.md (Security section).
    """
    if not request:
        return None
    xff = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'slug', 'short_description', 'long_description', 
                  'is_active', 'display_order', 'price_from']
        read_only_fields = ['id']


class BookingSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    vat_config = serializers.SerializerMethodField()
    estimated_hours = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        required=False,
        allow_null=True,
        min_value=Decimal('0.5'),
    )
    honeypot = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        trim_whitespace=True,
    )
    captcha_token = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        trim_whitespace=True,
    )

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
            'honeypot',
            'captcha_token',
        ]
        read_only_fields = [
            'id',
            'status',
            'created_at',
            'estimated_price',
            'promo_discount',
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

    def validate_honeypot(self, value):
        if value:
            raise serializers.ValidationError("Invalid submission.")
        return value

    def validate(self, attrs):
        attrs = super().validate(attrs)
        self._resolve_promotion(attrs)
        self._validate_captcha(attrs.get('captcha_token', ''))
        self._validate_recent_duplicate(attrs)
        return attrs

    def _resolve_promotion(self, attrs):
        """Apply discount only from an active Promotion row; ignore client promo_discount."""
        raw = attrs.get('promo_code') or ''
        code = raw.strip()
        if not code:
            self._resolved_promo_discount = None
            attrs['promo_code'] = ''
            return
        try:
            promotion = Promotion.objects.get(promo_code__iexact=code)
        except Promotion.DoesNotExist:
            raise serializers.ValidationError(
                {'promo_code': 'Invalid promotional code.'},
            )
        if not promotion.is_active or not promotion.is_currently_active():
            raise serializers.ValidationError(
                {'promo_code': 'This promotional code is not valid at this time.'},
            )
        self._resolved_promo_discount = promotion.discount_percentage
        attrs['promo_code'] = promotion.promo_code

    def _validate_captcha(self, token):
        secret = settings.CONTACT_FORM_CAPTCHA_SECRET
        if not secret:
            return
        if not token:
            raise serializers.ValidationError({"captcha_token": "Captcha validation failed."})
        remote_ip = _client_ip_for_captcha(self.context.get('request'))
        err = verify_recaptcha_token(token, remote_ip=remote_ip)
        if err:
            raise serializers.ValidationError({"captcha_token": err})

    def _validate_recent_duplicate(self, attrs):
        window_minutes = int(getattr(settings, "PUBLIC_FORM_DUPLICATE_WINDOW_MINUTES", 10))
        cutoff = timezone.now() - timedelta(minutes=window_minutes)
        recent_duplicate = Booking.objects.filter(
            email__iexact=attrs.get("email", ""),
            phone=attrs.get("phone", ""),
            service=attrs.get("service"),
            preferred_date=attrs.get("preferred_date"),
            created_at__gte=cutoff,
        ).exists()
        if recent_duplicate:
            raise serializers.ValidationError("Duplicate booking request detected. Please wait before retrying.")

    def create(self, validated_data):
        """Automatically calculate an estimated quote, apply promo discount, and calculate VAT."""
        validated_data.pop('honeypot', None)
        validated_data.pop('captcha_token', None)
        service = validated_data.get('service')
        resolved_discount = getattr(self, '_resolved_promo_discount', None)
        validated_data['promo_discount'] = resolved_discount
        pricing = calculate_booking_pricing(
            service_price_from=getattr(service, 'price_from', None),
            billing_type=validated_data.get('billing_type', 'fixed'),
            estimated_hours=validated_data.get('estimated_hours'),
            promo_code=validated_data.get('promo_code', ''),
            promo_discount=resolved_discount,
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
    honeypot = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        trim_whitespace=True,
    )
    captcha_token = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        trim_whitespace=True,
    )

    class Meta:
        model = ContactRequest
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'message',
            'handled',
            'created_at',
            'honeypot',
            'captcha_token',
        ]
        read_only_fields = ['id', 'handled', 'created_at']

    def validate_honeypot(self, value):
        if value:
            raise serializers.ValidationError("Invalid submission.")
        return value

    def validate(self, attrs):
        attrs = super().validate(attrs)
        self._validate_captcha(attrs.get('captcha_token', ''))
        self._validate_fingerprint(attrs)
        return attrs

    def _validate_captcha(self, token):
        secret = settings.CONTACT_FORM_CAPTCHA_SECRET
        if not secret:
            return
        if not token:
            raise serializers.ValidationError({"captcha_token": "Captcha validation failed."})
        remote_ip = _client_ip_for_captcha(self.context.get('request'))
        err = verify_recaptcha_token(token, remote_ip=remote_ip)
        if err:
            raise serializers.ValidationError({"captcha_token": err})

    def _validate_fingerprint(self, attrs):
        """Duplicate detection via DB so it works across workers/instances."""
        normalized_email = attrs.get("email", "").strip().lower()
        normalized_message = " ".join(attrs.get("message", "").split()).lower()
        window_seconds = int(getattr(settings, "PUBLIC_FORM_FINGERPRINT_WINDOW_SECONDS", 300))
        cutoff = timezone.now() - timedelta(seconds=window_seconds)
        recent = ContactRequest.objects.filter(
            email__iexact=normalized_email,
            created_at__gte=cutoff,
        ).order_by("-created_at")[:50]
        for cr in recent:
            if " ".join(cr.message.split()).lower() == normalized_message:
                raise serializers.ValidationError(
                    "Duplicate contact request detected. Please wait before retrying.",
                )

    def create(self, validated_data):
        validated_data.pop('honeypot', None)
        validated_data.pop('captcha_token', None)
        return super().create(validated_data)


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
            'published_at',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'published_at']

