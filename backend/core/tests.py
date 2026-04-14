from decimal import Decimal

from django.conf import settings
from django.contrib import admin
from django.core import mail
from django.test import Client, RequestFactory, TestCase
from django.test.utils import override_settings
from django.utils import timezone

from .admin import BookingAdmin, InvoiceAdmin, PromotionAdmin
from .models import Booking, Invoice, Promotion, Service


class PromotionAndBookingFlowTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.service = Service.objects.create(
            name="Standard Cleaning",
            slug="standard-cleaning",
            short_description="Standard cleaning service",
            long_description="Full standard cleaning",
            is_active=True,
            display_order=1,
            price_from=Decimal("100.00"),
        )

    def test_active_promotion_api_returns_current_promotion(self):
        """API should return the currently active promotion for the banner."""
        now = timezone.now()
        promo = Promotion.objects.create(
            title="Spring Sale",
            subtitle="10% off all services",
            badge_text="Limited Time",
            discount_percentage=Decimal("10.0"),
            promo_code="SPRING10",
            is_active=True,
            start_date=now - timezone.timedelta(days=1),
            end_date=now + timezone.timedelta(days=1),
        )

        response = self.client.get("/api/promotion/")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["promo_code"], promo.promo_code)
        self.assertTrue(data["is_currently_active"])

    def test_no_active_promotion_returns_404(self):
        """If there is no active promotion, the API should return 404."""
        response = self.client.get("/api/promotion/")
        self.assertEqual(response.status_code, 404)

    @override_settings(DEFAULT_VAT_RATE=0.20, APPLY_VAT_BY_DEFAULT=True)
    def test_booking_creation_applies_promo_and_vat(self):
        """Booking API should apply promo discount and VAT correctly."""
        # Create an active promotion whose code will be auto-applied on the frontend
        Promotion.objects.create(
            title="Spring Sale",
            subtitle="10% off all services",
            badge_text="Limited Time",
            discount_percentage=Decimal("10.0"),
            promo_code="SPRING10",
            is_active=True,
        )

        preferred_date = (timezone.now().date() + timezone.timedelta(days=1)).isoformat()

        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "service": self.service.id,
            "job_type": "residential",
            "billing_type": "fixed",
            "preferred_date": preferred_date,
            "preferred_time_window": "Morning (8am-12pm)",
            "address": "123 Main St",
            "notes": "",
            # The frontend sends both the promo code and the discount percentage
            "promo_code": "SPRING10",
            "promo_discount": "10.0",
        }

        response = self.client.post("/api/bookings/", data)
        self.assertEqual(response.status_code, 201)

        booking_id = response.json()["id"]
        booking = Booking.objects.get(id=booking_id)

        # Base price from service is 100.00
        self.assertEqual(booking.estimated_price, Decimal("100.00"))

        # 10% discount -> subtotal 90.00
        self.assertEqual(booking.subtotal, Decimal("90.00"))

        # VAT 20% of 90.00 -> 18.00, total -> 108.00
        self.assertEqual(booking.vat_amount.quantize(Decimal("0.01")), Decimal("18.00"))
        self.assertEqual(
            booking.total_with_vat.quantize(Decimal("0.01")), Decimal("108.00")
        )

    @override_settings(DEFAULT_VAT_RATE=0.20, APPLY_VAT_BY_DEFAULT=True)
    def test_booking_creation_without_promo_still_applies_vat(self):
        """Booking API should calculate VAT even when no promo code is used."""
        preferred_date = (timezone.now().date() + timezone.timedelta(days=1)).isoformat()

        data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "1234567890",
            "service": self.service.id,
            "job_type": "residential",
            "billing_type": "fixed",
            "preferred_date": preferred_date,
            "preferred_time_window": "Afternoon (12pm-4pm)",
            "address": "456 Main St",
            "notes": "",
        }

        response = self.client.post("/api/bookings/", data)
        self.assertEqual(response.status_code, 201)

        booking_id = response.json()["id"]
        booking = Booking.objects.get(id=booking_id)

        # Base price from service is 100.00, no discount
        self.assertEqual(booking.estimated_price, Decimal("100.00"))
        self.assertEqual(booking.subtotal, Decimal("100.00"))

        # VAT 20% of 100.00 -> 20.00, total -> 120.00
        self.assertEqual(booking.vat_amount.quantize(Decimal("0.01")), Decimal("20.00"))
        self.assertEqual(
            booking.total_with_vat.quantize(Decimal("0.01")), Decimal("120.00")
        )

    @override_settings(DEFAULT_VAT_RATE=0.20, APPLY_VAT_BY_DEFAULT=True)
    def test_vat_config_endpoint_returns_live_settings(self):
        response = self.client.get("/api/vat-config/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["default_vat_rate"], 0.2)
        self.assertEqual(data["vat_rate_percent"], 20.0)
        self.assertTrue(data["apply_vat_by_default"])
        self.assertEqual(data["currency"], "GBP")
        self.assertFalse(data["prices_include_vat"])

    def test_health_endpoint_returns_ok(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    @override_settings(DEFAULT_VAT_RATE=0.20, APPLY_VAT_BY_DEFAULT=True)
    def test_booking_create_response_includes_vat_config(self):
        preferred_date = (timezone.now().date() + timezone.timedelta(days=1)).isoformat()
        data = {
            "name": "API Config Test",
            "email": "cfg@example.com",
            "phone": "1234567890",
            "service": self.service.id,
            "job_type": "residential",
            "billing_type": "fixed",
            "preferred_date": preferred_date,
            "preferred_time_window": "Morning (8am-12pm)",
            "address": "1 Test St",
            "notes": "",
        }
        response = self.client.post("/api/bookings/", data)
        self.assertEqual(response.status_code, 201)
        body = response.json()
        self.assertIn("vat_config", body)
        self.assertEqual(body["vat_config"]["default_vat_rate"], 0.2)


class AdminActionsTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.service = Service.objects.create(
            name="Standard Cleaning",
            slug="standard-cleaning",
            short_description="Standard cleaning service",
            long_description="Full standard cleaning",
            is_active=True,
            display_order=1,
            price_from=Decimal("100.00"),
        )

    def _create_completed_booking(self):
        preferred_date = timezone.now().date() + timezone.timedelta(days=1)
        return Booking.objects.create(
            name="Invoice Customer",
            email="customer@example.com",
            phone="1234567890",
            service=self.service,
            job_type="residential",
            billing_type="fixed",
            preferred_date=preferred_date,
            preferred_time_window="Morning (8am-12pm)",
            address="789 Main St",
            status="completed",
            estimated_price=Decimal("100.00"),
            promo_code="SPRING10",
            promo_discount=Decimal("10.0"),
            subtotal=Decimal("90.00"),
            vat_amount=Decimal("18.00"),
            total_with_vat=Decimal("108.00"),
        )

    def test_generate_receipts_creates_invoice_for_booking(self):
        """Booking admin action should create invoices for selected bookings."""
        booking = self._create_completed_booking()

        booking_admin = BookingAdmin(Booking, admin.site)
        # Avoid needing Django messages framework in tests
        booking_admin.message_user = lambda *args, **kwargs: None

        queryset = Booking.objects.filter(id=booking.id)
        booking_admin.generate_receipts(request=None, queryset=queryset)

        self.assertTrue(
            Invoice.objects.filter(booking=booking).exists(),
            "Invoice should be created for the booking",
        )
        invoice = Invoice.objects.get(booking=booking)
        self.assertEqual(invoice.subtotal, booking.subtotal)
        self.assertEqual(invoice.vat_amount, booking.vat_amount)
        self.assertEqual(invoice.total, booking.total_with_vat)

    @override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
    def test_email_receipts_sends_email_and_updates_invoice(self):
        """Invoice admin action should email receipts and update invoice fields."""
        booking = self._create_completed_booking()
        invoice = Invoice.objects.create(
            booking=booking,
            description=f"{booking.service.name} - {booking.get_job_type_display()} ({booking.get_billing_type_display()})",
            subtotal=booking.subtotal,
            vat_amount=booking.vat_amount,
            total=booking.total_with_vat,
            status="draft",
        )

        invoice_admin = InvoiceAdmin(Invoice, admin.site)
        # Avoid needing Django messages framework in tests
        invoice_admin.message_user = lambda *args, **kwargs: None

        queryset = Invoice.objects.filter(id=invoice.id)
        invoice_admin.email_receipts(request=None, queryset=queryset)

        invoice.refresh_from_db()

        self.assertEqual(invoice.status, "sent")
        self.assertEqual(invoice.sent_to_email, booking.email)
        self.assertIsNotNone(invoice.sent_at)

        # Ensure an email was actually "sent"
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(booking.email, mail.outbox[0].to)

    def test_set_as_active_banner_promo_activates_selected_and_deactivates_others(self):
        """Promotion admin action should activate selected promo and deactivate others."""
        now = timezone.now()
        
        # Create multiple promotions
        promo1 = Promotion.objects.create(
            title="Spring Sale",
            promo_code="SPRING10",
            discount_percentage=Decimal("10.0"),
            is_active=True,
            start_date=now - timezone.timedelta(days=1),
            end_date=now + timezone.timedelta(days=1),
        )
        promo2 = Promotion.objects.create(
            title="Summer Sale",
            promo_code="SUMMER20",
            discount_percentage=Decimal("20.0"),
            is_active=True,
            start_date=now - timezone.timedelta(days=1),
            end_date=now + timezone.timedelta(days=1),
        )
        promo3 = Promotion.objects.create(
            title="Winter Sale",
            promo_code="WINTER15",
            discount_percentage=Decimal("15.0"),
            is_active=False,  # Initially inactive
            start_date=now - timezone.timedelta(days=1),
            end_date=now + timezone.timedelta(days=1),
        )
        
        # Verify initial state
        self.assertTrue(promo1.is_active)
        self.assertTrue(promo2.is_active)
        self.assertFalse(promo3.is_active)
        
        # Use admin action to set promo3 as active banner promo
        promotion_admin = PromotionAdmin(Promotion, admin.site)
        promotion_admin.message_user = lambda *args, **kwargs: None
        
        queryset = Promotion.objects.filter(id=promo3.id)
        promotion_admin.set_as_active_banner_promo(request=None, queryset=queryset)
        
        # Refresh from database
        promo1.refresh_from_db()
        promo2.refresh_from_db()
        promo3.refresh_from_db()
        
        # Verify promo3 is now active and others are deactivated
        self.assertFalse(promo1.is_active, "promo1 should be deactivated")
        self.assertFalse(promo2.is_active, "promo2 should be deactivated")
        self.assertTrue(promo3.is_active, "promo3 should be activated")

    def test_deactivate_all_promotions_action(self):
        """Promotion admin action should deactivate selected promotions."""
        promo1 = Promotion.objects.create(
            title="Spring Sale",
            promo_code="SPRING10",
            discount_percentage=Decimal("10.0"),
            is_active=True,
        )
        promo2 = Promotion.objects.create(
            title="Summer Sale",
            promo_code="SUMMER20",
            discount_percentage=Decimal("20.0"),
            is_active=True,
        )
        
        promotion_admin = PromotionAdmin(Promotion, admin.site)
        promotion_admin.message_user = lambda *args, **kwargs: None
        
        queryset = Promotion.objects.filter(id__in=[promo1.id, promo2.id])
        promotion_admin.deactivate_all_promotions(request=None, queryset=queryset)
        
        promo1.refresh_from_db()
        promo2.refresh_from_db()
        
        self.assertFalse(promo1.is_active)
        self.assertFalse(promo2.is_active)

