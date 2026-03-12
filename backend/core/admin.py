from django.contrib import admin
from django.utils import timezone
from django.urls import path
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed
from .models import Service, Booking, ContactRequest, Promotion, Invoice, BlogPost
from .utils import compute_invoice_pricing_from_booking


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'display_order', 'price_from', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'short_description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['display_order', 'name']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'service', 'preferred_date', 'status', 'total_with_vat', 'has_invoice', 'created_at']
    list_filter = ['status', 'preferred_date', 'created_at', 'service', 'job_type', 'billing_type']
    search_fields = ['name', 'email', 'phone', 'address', 'promo_code']
    readonly_fields = ['created_at', 'updated_at', 'subtotal', 'vat_amount', 'total_with_vat']
    date_hierarchy = 'preferred_date'
    ordering = ['-created_at']
    fieldsets = (
        ('Customer Information', {
            'fields': ('name', 'email', 'phone', 'address')
        }),
        ('Service Details', {
            'fields': ('service', 'job_type', 'billing_type', 'preferred_date', 'preferred_time_window', 'estimated_hours', 'notes')
        }),
        ('Pricing', {
            'fields': ('estimated_price', 'promo_code', 'promo_discount', 'subtotal', 'vat_amount', 'total_with_vat')
        }),
        ('Status', {
            'fields': ('status', 'created_at', 'updated_at')
        }),
    )
    actions = ['generate_receipts']

    def has_invoice(self, obj):
        """Check if booking has an invoice"""
        return hasattr(obj, 'invoice')
    has_invoice.boolean = True
    has_invoice.short_description = 'Has Invoice'

    def generate_receipts(self, request, queryset):
        """Admin action to generate receipts for selected bookings.
        Uses compute_invoice_pricing_from_booking so amounts are calculated from
        service price, hours, promo, and VAT settings (not from possibly empty booking fields).
        """
        created_count = 0
        for booking in queryset:
            if hasattr(booking, 'invoice'):
                continue

            pricing = compute_invoice_pricing_from_booking(booking)
            parts = []
            if booking.service:
                parts.append(booking.service.name)
            parts.append(booking.get_job_type_display())
            parts.append(booking.get_billing_type_display())
            if booking.estimated_hours:
                parts.append(f"{booking.estimated_hours}h")
            description = " - ".join(parts)

            Invoice.objects.create(
                booking=booking,
                description=description,
                subtotal=pricing["subtotal"],
                vat_amount=pricing["vat_amount"],
                total=pricing["total"],
                status='draft',
            )
            created_count += 1

        self.message_user(request, f"Successfully created {created_count} receipt(s).")
    generate_receipts.short_description = "Generate receipts for selected bookings"


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ['title', 'promo_code', 'discount_percentage', 'is_active', 'is_currently_active', 'start_date', 'end_date', 'banner_status']
    list_filter = ['is_active', 'start_date', 'end_date']
    search_fields = ['title', 'promo_code', 'subtitle']
    readonly_fields = ['created_at', 'updated_at', 'is_currently_active', 'banner_help_text']
    ordering = ['-created_at']
    actions = ['set_as_active_banner_promo', 'deactivate_all_promotions']
    fieldsets = (
        ('Promotion Details', {
            'fields': ('title', 'subtitle', 'badge_text', 'promo_code', 'discount_percentage')
        }),
        ('Status & Dates', {
            'fields': ('is_active', 'start_date', 'end_date', 'is_currently_active', 'banner_help_text'),
            'description': 'Set "Is active" to True and ensure dates are valid for the promotion to appear in the banner. Use the admin action "Set as active banner promo" to automatically activate this and deactivate others.'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def banner_status(self, obj):
        """Show if this promotion is currently active and would appear in the banner"""
        if obj.is_active and obj.is_currently_active():
            return "🟢 Active Banner"
        elif obj.is_active:
            return "🟡 Active (Outside Date Range)"
        else:
            return "⚪ Inactive"
    banner_status.short_description = 'Banner Status'

    def banner_help_text(self, obj):
        """Display helpful information about banner activation"""
        if obj.pk:
            # Find other promotions that are currently active (using the method)
            now = timezone.now()
            other_active = [
                p for p in Promotion.objects.filter(is_active=True).exclude(pk=obj.pk)
                if p.is_currently_active()
            ]
            
            if other_active:
                other_promos = ", ".join([f"{p.title} ({p.promo_code})" for p in other_active[:3]])
                if len(other_active) > 3:
                    other_promos += f" and {len(other_active) - 3} more"
                return f"⚠️ Note: {len(other_active)} other active promotion(s) will be deactivated: {other_promos}"
            elif obj.is_active and obj.is_currently_active():
                return "✅ This promotion is currently active and will appear in the banner."
            elif obj.is_active:
                return "ℹ️ This promotion is active but won't appear in the banner (check start/end dates)."
            else:
                return "ℹ️ Activate this promotion to make it appear in the banner (if dates are valid)."
        return "ℹ️ Save this promotion first, then use the admin action to set it as the active banner promo."
    banner_help_text.short_description = 'Banner Activation Info'

    def set_as_active_banner_promo(self, request, queryset):
        """Admin action to set selected promotion(s) as active banner promo and deactivate others"""
        updated_count = 0
        deactivated_count = 0
        
        # Get IDs of selected promotions
        selected_ids = list(queryset.values_list('id', flat=True))
        
        # Deactivate all other promotions
        other_promos = Promotion.objects.exclude(id__in=selected_ids).filter(is_active=True)
        deactivated_count = other_promos.update(is_active=False)
        
        # Activate selected promotions
        for promotion in queryset:
            if not promotion.is_active:
                promotion.is_active = True
                promotion.save()
                updated_count += 1
            else:
                updated_count += 1
        
        messages = []
        if updated_count > 0:
            messages.append(f"Activated {updated_count} promotion(s) for banner display.")
        if deactivated_count > 0:
            messages.append(f"Deactivated {deactivated_count} other promotion(s).")
        
        if messages:
            self.message_user(request, " ".join(messages))
        else:
            self.message_user(request, "No changes made.")
    set_as_active_banner_promo.short_description = "Set as active banner promo (deactivates others)"

    def deactivate_all_promotions(self, request, queryset):
        """Admin action to deactivate selected promotions"""
        count = queryset.filter(is_active=True).update(is_active=False)
        self.message_user(request, f"Deactivated {count} promotion(s).")
    deactivate_all_promotions.short_description = "Deactivate selected promotions"


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'booking_name', 'booking_email', 'total', 'status', 'sent_to_email', 'issue_date']
    list_filter = ['status', 'issue_date', 'sent_at']
    search_fields = ['invoice_number', 'booking__name', 'booking__email', 'sent_to_email']
    readonly_fields = ['invoice_number', 'created_at', 'updated_at', 'sent_at']
    ordering = ['-issue_date', '-created_at']
    fieldsets = (
        ('Invoice Information', {
            'fields': ('invoice_number', 'booking', 'issue_date', 'due_date')
        }),
        ('Details', {
            'fields': ('description', 'subtotal', 'vat_amount', 'total')
        }),
        ('Status & Delivery', {
            'fields': ('status', 'sent_to_email', 'sent_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['email_receipts']

    class Media:
        js = ('core/js/invoice_admin.js',)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'generate-from-booking/',
                self.admin_site.admin_view(self.generate_from_booking_view),
                name='core_invoice_generate_from_booking',
            ),
        ]
        return custom_urls + urls

    def generate_from_booking_view(self, request):
        if request.method != 'POST':
            return HttpResponseNotAllowed(['POST'])

        booking_id = request.POST.get('booking_id')
        if not booking_id:
            return HttpResponseBadRequest('Missing booking_id')

        try:
            booking = Booking.objects.get(pk=booking_id)
        except Booking.DoesNotExist:
            return HttpResponseBadRequest('Invalid booking_id')

        pricing = compute_invoice_pricing_from_booking(booking)

        # Build a helpful default description including service and hours where available
        parts = []
        if booking.service:
            parts.append(booking.service.name)
        parts.append(booking.get_job_type_display())
        parts.append(booking.get_billing_type_display())
        if booking.estimated_hours:
            parts.append(f"{booking.estimated_hours}h")
        description = " - ".join(parts)

        return JsonResponse(
            {
                'subtotal': str(pricing['subtotal']),
                'vat_amount': str(pricing['vat_amount']),
                'total': str(pricing['total']),
                'description': description,
            }
        )

    def booking_name(self, obj):
        return obj.booking.name
    booking_name.short_description = 'Customer Name'

    def booking_email(self, obj):
        return obj.booking.email
    booking_email.short_description = 'Customer Email'

    def email_receipts(self, request, queryset):
        """Admin action to email receipts to clients"""
        from .utils import send_invoice_email
        
        sent_count = 0
        for invoice in queryset:
            if invoice.status == 'draft':
                invoice.status = 'sent'
                invoice.save()
            
            try:
                send_invoice_email(invoice)
                invoice.sent_to_email = invoice.booking.email
                invoice.sent_at = timezone.now()
                invoice.save()
                sent_count += 1
            except Exception as e:
                self.message_user(request, f"Failed to send invoice {invoice.invoice_number}: {str(e)}", level='ERROR')
        
        self.message_user(request, f"Successfully sent {sent_count} receipt(s) via email.")
    email_receipts.short_description = "Email selected receipts to clients"


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'handled', 'created_at']
    list_filter = ['handled', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'is_published', 'published_at', 'created_at']
    list_filter = ['is_published', 'published_at', 'created_at']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'published_at']
    ordering = ['-published_at', '-created_at']
