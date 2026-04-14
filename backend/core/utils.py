from decimal import Decimal
from django.core.mail import send_mail
from django.conf import settings


def get_vat_config_payload():
    """
    Active VAT/tax settings used for quotes and invoices.
    Shared by GET /vat-config/ and booking create responses.
    """
    vat_rate = float(getattr(settings, "DEFAULT_VAT_RATE", 0.20))
    apply_vat = bool(getattr(settings, "APPLY_VAT_BY_DEFAULT", True))
    return {
        "default_vat_rate": vat_rate,
        "vat_rate_percent": round(vat_rate * 100, 2),
        "apply_vat_by_default": apply_vat,
        "currency": "GBP",
        "prices_include_vat": False,
    }


def calculate_booking_pricing(
    *,
    service_price_from,
    billing_type,
    estimated_hours=None,
    promo_code="",
    promo_discount=None,
):
    """
    Shared booking pricing calculator used by booking and invoicing flows.
    Returns base_price, discount_amount, subtotal, vat_amount, total.
    """
    base_price = Decimal("0.00")
    if service_price_from is not None:
        base_price = Decimal(str(service_price_from))
        if billing_type == "hourly" and estimated_hours:
            base_price = base_price * Decimal(str(estimated_hours))

    subtotal = base_price
    discount_amount = Decimal("0.00")
    if promo_code and promo_discount:
        promo_discount_decimal = Decimal(str(promo_discount))
        discount_amount = subtotal * (promo_discount_decimal / Decimal("100"))
        subtotal = subtotal - discount_amount

    if getattr(settings, "APPLY_VAT_BY_DEFAULT", True):
        vat_rate = Decimal(str(getattr(settings, "DEFAULT_VAT_RATE", 0.20)))
        vat_amount = subtotal * vat_rate
    else:
        vat_amount = Decimal("0.00")

    total = subtotal + vat_amount

    return {
        "base_price": base_price,
        "discount_amount": discount_amount,
        "subtotal": subtotal,
        "vat_amount": vat_amount,
        "total": total,
    }


def compute_invoice_pricing_from_booking(booking):
    """
    Compute base price, subtotal, VAT amount, and total for an invoice
    based on a Booking instance and current VAT settings.
    """
    service = getattr(booking, "service", None)

    return calculate_booking_pricing(
        service_price_from=getattr(service, "price_from", None),
        billing_type=getattr(booking, "billing_type", "fixed"),
        estimated_hours=getattr(booking, "estimated_hours", None),
        promo_code=getattr(booking, "promo_code", ""),
        promo_discount=getattr(booking, "promo_discount", None),
    )


def send_booking_notification(booking):
    """Send email notification when a new booking is created"""
    admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@africleans.com')
    
    vat_rate_percent = int(Decimal(str(getattr(settings, "DEFAULT_VAT_RATE", 0.20))) * Decimal("100"))
    subject = f'New Booking Request: {booking.service.name}'
    message = f"""
New booking request received:

Name: {booking.name}
Email: {booking.email}
Phone: {booking.phone}
Service: {booking.service.name}
Job Type: {booking.get_job_type_display()}
Billing Type: {booking.get_billing_type_display()}
Preferred Date: {booking.preferred_date}
Preferred Time: {booking.preferred_time_window}
Address: {booking.address}
Notes: {booking.notes or 'None'}

Estimated Hours: {booking.estimated_hours or 'Not specified'}
Base Price: GBP {booking.estimated_price or 'Not calculated'}
Promo Code: {booking.promo_code or 'None'}
Promo Discount: {f"{booking.promo_discount}%" if booking.promo_discount else "None"}
Subtotal: GBP {booking.subtotal or booking.estimated_price or 'Not calculated'}
VAT Amount: GBP {booking.vat_amount or '0.00'}
Total (with VAT): GBP {booking.total_with_vat or booking.subtotal or booking.estimated_price or 'Not calculated'}

You can view and manage this booking in the Django admin panel.
"""
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [admin_email],
        fail_silently=False,
    )

    # Optional: Send confirmation email to customer
    customer_subject = 'Booking Request Received - Afri Cleans'
    customer_message = f"""
Dear {booking.name},

Thank you for your booking request with Afri Cleans!

We have received your request for {booking.service.name} on {booking.preferred_date} 
during {booking.preferred_time_window}.

Job type: {booking.get_job_type_display()}
Billing: {booking.get_billing_type_display()}

Estimated hours: {booking.estimated_hours or 'Not specified'}

Pricing Estimate:
Base Price: GBP {booking.estimated_price or 'To be confirmed'}
{f"Promo Code Applied: {booking.promo_code} ({booking.promo_discount}% off)" if booking.promo_code else ""}
Subtotal: GBP {booking.subtotal or booking.estimated_price or 'To be confirmed'}
{f"VAT ({vat_rate_percent}%): GBP {booking.vat_amount}" if booking.vat_amount else ""}
Total Estimate: GBP {booking.total_with_vat or booking.subtotal or booking.estimated_price or 'To be confirmed after site visit'}

Note: This is an instant estimate. Final pricing will be confirmed after our team reviews your request.

Our team will review your request and contact you shortly to confirm your appointment.

If you have any questions, please don't hesitate to contact us.

Best regards,
Afri Cleans Team
"""
    
    try:
        send_mail(
            customer_subject,
            customer_message,
            settings.DEFAULT_FROM_EMAIL,
            [booking.email],
            fail_silently=True,  # Don't fail if customer email fails
        )
    except Exception:
        pass


def send_invoice_email(invoice):
    """Send invoice/receipt email to client"""
    from .models import Invoice
    
    customer_email = invoice.booking.email
    customer_name = invoice.booking.name
    
    vat_rate_percent = int(Decimal(str(getattr(settings, "DEFAULT_VAT_RATE", 0.20))) * Decimal("100"))
    subject = f'Invoice {invoice.invoice_number} - Afri Cleans'
    
    # Create HTML email content
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #005461;">Afri Cleans - Invoice</h2>
            
            <p>Dear {customer_name},</p>
            
            <p>Thank you for choosing Afri Cleans! Please find your invoice details below:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Invoice Number:</strong> {invoice.invoice_number}</p>
                <p><strong>Issue Date:</strong> {invoice.issue_date.strftime('%B %d, %Y')}</p>
                {f'<p><strong>Due Date:</strong> {invoice.due_date.strftime("%B %d, %Y")}</p>' if invoice.due_date else ''}
                <p><strong>Service:</strong> {invoice.description}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Subtotal:</td>
                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">GBP {invoice.subtotal:.2f}</td>
                </tr>
                {f'<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">VAT ({vat_rate_percent}%):</td><td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">GBP {invoice.vat_amount:.2f}</td></tr>' if invoice.vat_amount > 0 else ''}
                <tr style="background-color: #e8f4f5;">
                    <td style="padding: 12px; font-weight: bold; font-size: 1.1em;">Total:</td>
                    <td style="text-align: right; padding: 12px; font-weight: bold; font-size: 1.1em;">GBP {invoice.total:.2f}</td>
                </tr>
            </table>
            
            <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>Afri Cleans Team</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 0.9em; color: #666;">
                Afri Cleans<br>
                Phone: (+012)87059897<br>
                Email: info@africleans.com
            </p>
        </div>
    </body>
    </html>
    """
    
    # Plain text version
    plain_message = f"""
Afri Cleans - Invoice

Dear {customer_name},

Thank you for choosing Afri Cleans! Please find your invoice details below:

Invoice Number: {invoice.invoice_number}
Issue Date: {invoice.issue_date.strftime('%B %d, %Y')}
{f'Due Date: {invoice.due_date.strftime("%B %d, %Y")}' if invoice.due_date else ''}
Service: {invoice.description}

Subtotal: GBP {invoice.subtotal:.2f}
{f'VAT ({vat_rate_percent}%): GBP {invoice.vat_amount:.2f}' if invoice.vat_amount > 0 else ''}
Total: GBP {invoice.total:.2f}

If you have any questions about this invoice, please don't hesitate to contact us.

Best regards,
Afri Cleans Team

---
Afri Cleans
Phone: (+012)87059897
Email: info@africleans.com
"""
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [customer_email],
        html_message=html_message,
        fail_silently=False,
    )


def send_contact_notification(contact_request):
    """Send email notification when a new contact request is created"""
    admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@africleans.com')
    
    subject = f'New Contact Request from {contact_request.name}'
    message = f"""
New contact request received:

Name: {contact_request.name}
Email: {contact_request.email}
Phone: {contact_request.phone or 'Not provided'}

Message:
{contact_request.message}

You can view and manage this contact request in the Django admin panel.
"""
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [admin_email],
        fail_silently=False,
    )

