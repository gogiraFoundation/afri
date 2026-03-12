from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone


class Service(models.Model):
    """Cleaning service offered by Afri Cleans"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    short_description = models.TextField(max_length=500)
    long_description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    price_from = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class Booking(models.Model):
    """Booking request from customers"""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    JOB_TYPE_CHOICES = [
        ('residential', 'Residential Cleaning'),
        ('commercial', 'Commercial Cleaning'),
        ('office', 'Office Cleaning'),
        ('hourly', 'Per-Hour Cleaning'),
    ]

    BILLING_TYPE_CHOICES = [
        ('fixed', 'Fixed package'),
        ('hourly', 'Hourly billing'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='residential')
    billing_type = models.CharField(max_length=20, choices=BILLING_TYPE_CHOICES, default='fixed')
    preferred_date = models.DateField()
    preferred_time_window = models.CharField(max_length=50)
    address = models.TextField()
    notes = models.TextField(blank=True)
    estimated_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.5)],
        help_text="Estimated hours for the job (used for hourly billing).",
    )
    estimated_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Estimated quote calculated for this booking.",
    )
    promo_code = models.CharField(max_length=50, blank=True, help_text="Promotional code applied to this booking.")
    promo_discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Discount percentage applied from promotion.",
    )
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Subtotal before tax/VAT.",
    )
    vat_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="VAT amount calculated.",
    )
    total_with_vat = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total amount including VAT.",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.service.name} - {self.preferred_date}"

    def clean(self):
        from django.core.exceptions import ValidationError

        if self.preferred_date < timezone.now().date():
            raise ValidationError({'preferred_date': 'Preferred date cannot be in the past.'})

        # Basic sanity check for hourly bookings
        if self.billing_type == 'hourly' and not self.estimated_hours:
            raise ValidationError({'estimated_hours': 'Estimated hours are required for hourly billing.'})


class Promotion(models.Model):
    """Promotional offers and campaigns"""
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    badge_text = models.CharField(max_length=50, blank=True, help_text="Short badge text like 'Limited Time'")
    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Discount percentage (e.g., 15.00 for 15%)",
    )
    promo_code = models.CharField(max_length=50, unique=True, help_text="Unique promotional code")
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.promo_code}"

    def is_currently_active(self):
        """Check if promotion is currently active based on dates and flag"""
        if not self.is_active:
            return False
        now = timezone.now()
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        return True


class Invoice(models.Model):
    """Invoice/Receipt for completed bookings"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]

    invoice_number = models.CharField(max_length=50, unique=True)
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='invoice')
    issue_date = models.DateField(default=timezone.now)
    due_date = models.DateField(null=True, blank=True)
    description = models.TextField(help_text="Service description and line items")
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    sent_to_email = models.EmailField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-issue_date', '-created_at']

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.booking.name}"

    def save(self, *args, **kwargs):
        """Auto-generate invoice number if not provided"""
        if not self.invoice_number:
            # Generate invoice number: INV-YYYYMMDD-XXXX
            from datetime import date
            today = date.today()
            prefix = f"INV-{today.strftime('%Y%m%d')}"
            last_invoice = Invoice.objects.filter(invoice_number__startswith=prefix).order_by('-invoice_number').first()
            if last_invoice:
                try:
                    last_num = int(last_invoice.invoice_number.split('-')[-1])
                    next_num = last_num + 1
                except (ValueError, IndexError):
                    next_num = 1
            else:
                next_num = 1
            self.invoice_number = f"{prefix}-{next_num:04d}"
        super().save(*args, **kwargs)


class ContactRequest(models.Model):
    """Contact form submissions"""
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    handled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.email} - {self.created_at.date()}"


class BlogPost(models.Model):
    """Long-form marketing and SEO blog posts"""

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, help_text="URL-friendly identifier, generated from the title.")
    excerpt = models.TextField(blank=True, help_text="Short teaser used in lists and previews.")
    content = models.TextField(help_text="Full blog content in Markdown or HTML.")
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.CharField(max_length=300, blank=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.is_published and self.published_at is None:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)
