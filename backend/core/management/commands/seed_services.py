from django.core.management.base import BaseCommand
from core.models import Service


class Command(BaseCommand):
    help = 'Seed initial services for Afri Cleans'

    def handle(self, *args, **options):
        services_data = [
            {
                'name': 'Residential Eco-Clean',
                'slug': 'residential-cleaning',
                'short_description': 'Homes and flats — weekly, deep, or move-out visits with the same Eco-Clean checklist.',
                'long_description': (
                    'Every residential visit follows our Eco-Clean standard: microfibre dusting (no paper towels), '
                    'HEPA vacuuming and steam mopping, kitchen wipe-down with hob degreasing and sanitised worktops, '
                    'bathroom scrub with mirror and chrome polishing, and tidy rubbish and recycling. '
                    'Choose weekly or recurring visits, a deep clean, or end-of-tenancy handover — scope stays the same; '
                    'time on site and detail level adjust to the visit type.'
                ),
                'is_active': True,
                'display_order': 1,
                'price_from': 99.00,
            },
            {
                'name': 'Office Eco-Clean',
                'slug': 'office-cleaning',
                'short_description': 'Workspaces — scheduled rounds with the same Eco-Clean standard as our home visits.',
                'long_description': (
                    'Desks, meeting rooms, kitchens, and washrooms for small and medium offices. '
                    'The same Eco-Clean checklist as residential: microfibre dusting, HEPA-filtered vacuuming and steam '
                    'mopping, kitchen and bathroom care, and neat waste and recycling. '
                    'Book weekly or recurring cleans, a periodic deep clean, or move-out readiness.'
                ),
                'is_active': True,
                'display_order': 2,
                'price_from': 199.00,
            },
            {
                'name': 'Deep clean & end of tenancy',
                'slug': 'deep-clean-end-of-tenancy',
                'short_description': 'Longer on-site reset or handover — same Eco-Clean scope, extra time where it counts.',
                'long_description': (
                    'Not a separate “line” of work: the same Eco-Clean checklist with more hours for buildup, '
                    'detail, and landlord-ready finish. Ideal after a busy period, before handover, or when you want '
                    'a full reset while keeping the same methods and equipment standards.'
                ),
                'is_active': True,
                'display_order': 3,
                'price_from': 149.00,
            },
        ]

        updated_count = 0
        for service_data in services_data:
            slug = service_data['slug']
            defaults = {k: v for k, v in service_data.items() if k != 'slug'}
            _, created = Service.objects.update_or_create(slug=slug, defaults=defaults)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created service: {service_data["name"]}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'Updated service: {service_data["name"]}'))

        legacy_slugs = ('commercial-cleaning', 'carpet-cleaning')
        deactivated = Service.objects.filter(slug__in=legacy_slugs).update(is_active=False)
        if deactivated:
            self.stdout.write(
                self.style.WARNING(
                    f'Deactivated {deactivated} legacy service row(s): {", ".join(legacy_slugs)}.'
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Seed complete. {updated_count} existing row(s) refreshed by slug.'
            )
        )
