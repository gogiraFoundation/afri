from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import BlogPost


class Command(BaseCommand):
    help = 'Seed initial marketing blog posts for Afri Cleans'

    def handle(self, *args, **options):
        posts_data = [
            {
                'title': '10 Benefits of Professional Cleaning Services for a Healthier Home',
                'slug': 'benefits-of-professional-cleaning-services',
                'excerpt': (
                    'Discover how professional cleaning services improve your health, save time, '
                    'and create a safer, more comfortable home environment.'
                ),
                'content': """
# 10 Benefits of Professional Cleaning Services for a Healthier Home

A clean environment is more than just visually appealing—it directly impacts your **health, productivity, and overall quality of life**. While regular household cleaning helps maintain basic hygiene, professional cleaning services provide a deeper level of care that ensures every corner of your space is properly sanitized.

At **Afri Cleans**, we believe that a spotless environment leads to a **healthier and happier lifestyle**. Whether it's your home or workplace, professional cleaning can transform your space in ways you may not expect.

Here are **10 key benefits of hiring professional cleaning services.**

---

## 1. A Healthier Living Environment

Dust, bacteria, allergens, and germs accumulate in homes and offices over time. Professional cleaning removes hidden contaminants from surfaces, carpets, and air spaces, helping to reduce allergies and respiratory issues.

With deep sanitation techniques, professional cleaners ensure your environment stays **safe and hygienic for everyone.**

---

## 2. Saves You Time and Energy

Cleaning takes time—especially when you want to do it properly. Hiring professionals allows you to focus on what truly matters: **your work, family, and personal well-being**.

Instead of spending weekends scrubbing floors and cleaning bathrooms, you can enjoy a spotless space without the stress.

---

## 3. Professional-Grade Equipment and Products

Professional cleaners use **high-quality equipment and industry-grade cleaning solutions** that are more effective than typical household products.

These tools help eliminate:

* Stubborn stains  
* Deep-seated dirt  
* Bacteria and germs  
* Carpet odors  

The result is a **deeper and longer-lasting clean.**

---

## 4. Improved Indoor Air Quality

Dust, pet dander, and mold particles can affect indoor air quality. Professional cleaning services remove these contaminants from carpets, upholstery, and hidden areas.

Cleaner air means:

* Better breathing  
* Reduced allergies  
* A healthier home environment  

---

## 5. Consistent and Reliable Results

One of the biggest advantages of professional cleaning is **consistency**. At Afri Cleans, our trained team follows proven cleaning methods to ensure every service delivers outstanding results.

You can rely on us to maintain the same **high standard every time we clean your space.**

---

## 6. Extends the Life of Your Furniture and Surfaces

Dust and dirt can slowly damage surfaces such as carpets, floors, furniture, and countertops.

Regular professional cleaning helps protect your investment by:

* Preventing material deterioration  
* Maintaining carpet texture  
* Preserving furniture appearance  

This helps your home or office **look newer for longer.**

---

## 7. Stress Reduction

Living or working in a cluttered or dirty environment can increase stress and reduce productivity. A professionally cleaned space creates a **calm, organized, and comfortable atmosphere.**

A clean environment promotes:

* Better focus  
* Higher productivity  
* Improved mood  

---

## 8. Tailored Cleaning Services

Every space has unique cleaning needs. Professional cleaning companies provide **customized cleaning plans** based on your specific requirements.

At Afri Cleans, we offer services including:

* Residential cleaning  
* Commercial cleaning  
* Carpet cleaning  
* Window cleaning  
* Post-construction cleaning  
* Kitchen and bathroom cleaning  
* Eco-friendly cleaning solutions  

---

## 9. Perfect for Busy Households and Businesses

Whether you manage a busy household or run a company, keeping your space clean can be challenging.

Professional cleaning ensures your environment always looks **professional, welcoming, and well-maintained**—which is especially important for businesses that want to make a great impression on clients.

---

## 10. A Spotless Space Without the Hassle

The biggest benefit of professional cleaning services is simple: **peace of mind**.

Knowing that your home or office is being maintained by trained professionals allows you to enjoy a cleaner space without worrying about the details.

---

## Experience the Afri Cleans Difference

At **Afri Cleans**, we combine **experience, reliability, and modern cleaning techniques** to deliver exceptional results. Our dedicated cleaning professionals are committed to creating spaces that are not only spotless but also healthier and more comfortable.

Whether you need **residential cleaning, commercial cleaning, or deep cleaning services**, our team is ready to help you maintain a pristine environment.

---

### Ready for a Cleaner, Healthier Space?

Let Afri Cleans take care of the cleaning while you focus on what matters most.

📞 **Call us today:** (+012) 87059897  
📧 **Email:** info@africleans.com  

Or simply **book a service through our website** to get your free estimate.
""",
                'seo_title': '10 Benefits of Professional Cleaning Services for a Healthier Home | Afri Cleans',
                'seo_description': 'Learn how professional cleaning services from Afri Cleans improve health, save time, and keep your home or office spotless and stress-free.',
            },
        ]

        created_count = 0
        for data in posts_data:
            post, created = BlogPost.objects.get_or_create(
                slug=data['slug'],
                defaults={
                    'title': data['title'],
                    'excerpt': data['excerpt'],
                    'content': data['content'],
                    'seo_title': data.get('seo_title', ''),
                    'seo_description': data.get('seo_description', ''),
                    'is_published': True,
                    'published_at': timezone.now(),
                },
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created blog post: {post.title}"))
            else:
                self.stdout.write(self.style.WARNING(f"Blog post already exists: {post.title}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} blog post(s)."))

