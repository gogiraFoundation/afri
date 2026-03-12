from django.core.management.base import BaseCommand
from core.models import Service


class Command(BaseCommand):
    help = 'Seed initial services for Afri Cleans'

    def handle(self, *args, **options):
        services_data = [
            {
                'name': 'Residential Cleaning',
                'slug': 'residential-cleaning',
                'short_description': 'Experience a sparkling home with our thorough residential cleaning services.',
                'long_description': 'Our residential cleaning service includes deep cleaning of all rooms, kitchen and bathroom sanitization, dusting, vacuuming, and mopping. We use eco-friendly products to ensure a safe environment for your family.',
                'is_active': True,
                'display_order': 1,
                'price_from': 99.00,
            },
            {
                'name': 'Commercial Cleaning',
                'slug': 'commercial-cleaning',
                'short_description': 'Keep your business spotless with our professional commercial cleaning solutions.',
                'long_description': 'We provide comprehensive commercial cleaning services for offices, retail spaces, and other business establishments. Our team ensures a professional and hygienic environment for your employees and customers.',
                'is_active': True,
                'display_order': 2,
                'price_from': 199.00,
            },
            {
                'name': 'Carpet Cleaning',
                'slug': 'carpet-cleaning',
                'short_description': 'Deep clean and restore your carpets to their original beauty.',
                'long_description': 'Professional carpet cleaning using advanced steam cleaning and extraction methods. We remove deep-seated dirt, stains, and allergens to extend the life of your carpets.',
                'is_active': True,
                'display_order': 3,
                'price_from': 149.00,
            },
        ]

        created_count = 0
        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                slug=service_data['slug'],
                defaults=service_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created service: {service.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Service already exists: {service.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully seeded {created_count} new services.')
        )

