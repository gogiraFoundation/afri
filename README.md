# Afri Cleans - Professional Cleaning Services Website

A modern, responsive website for Afri Cleans featuring a React+TypeScript frontend and Django REST API backend. The site includes a full booking system, service listings, and contact forms.

## Project Structure

```
.
├── frontend/          # React + TypeScript + Vite application
├── backend/           # Django REST API backend
└── README.md          # This file
```

## Prerequisites

- **Node.js** (v18 or higher) and npm
- **Python** (v3.8 or higher) and pip
- **Git** (optional, for version control)

## Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment (recommended):**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Seed initial services data:**
   ```bash
   python manage.py seed_services
   ```

6. **Create a superuser (optional, for admin access):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

   The backend API will be available at `http://localhost:8000`
   - API endpoints: `http://localhost:8000/api/`
   - Admin panel: `http://localhost:8000/admin/`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` if needed (default should work for local development):
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Features

### Frontend
- **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop
- **Modern UI**: Clean, professional design with smooth animations
- **Sections**:
  - Hero section with call-to-action
  - About Us section with feature highlights
  - Services section with dynamic service cards
  - Why Choose Us section with statistics
  - Booking form with validation
  - Footer with contact information

### Backend
- **REST API**: Django REST Framework endpoints
- **Models**:
  - `Service`: Cleaning services offered
  - `Booking`: Customer booking requests
  - `ContactRequest`: Contact form submissions
- **Admin Panel**: Full Django admin interface for managing data
- **Email Notifications**: Automatic email notifications for new bookings/contacts

## API Endpoints

- `GET /api/services/` - List all active services
- `POST /api/bookings/` - Create a new booking request
- `POST /api/contact-requests/` - Submit a contact form

## Environment Variables

### Backend (Django)

For production, configure email settings in `backend/afri_cleans/settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@africleans.com')
```

### Frontend

Create `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

For production, update this to your backend API URL.

## Development Workflow

1. Start the backend server (`python manage.py runserver`)
2. Start the frontend dev server (`npm run dev`)
3. Open `http://localhost:5173` in your browser
4. Make changes to frontend/backend code
5. Changes will hot-reload automatically

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`. You can serve these with any static file server or integrate with your backend.

### Backend

1. Set `DEBUG = False` in `backend/afri_cleans/settings.py`
2. Configure `ALLOWED_HOSTS` with your domain
3. Set up proper database (PostgreSQL recommended for production)
4. Configure email backend with SMTP credentials
5. Collect static files: `python manage.py collectstatic`
6. Use a production WSGI server (e.g., Gunicorn) with a reverse proxy (e.g., Nginx)

## Color Palette

The site uses the following color scheme:

- **Primary Dark**: `#005461` - Headers, footer background
- **Primary Medium 1**: `#0C777F` - Hover states
- **Primary Medium 2**: `#249E94` - Primary buttons, active links
- **Primary Light**: `#3BC1A8` - Accents, highlights
- **Background**: `#FFFFFF` / `#F8FAFC` - Page backgrounds
- **Text Dark**: `#1E293B` - Body text
- **Text Light**: `#64748B` - Secondary text

## Typography

- **Font Family**: Inter (primary), Montserrat (fallback), sans-serif
- **Headings**: Bold (700) weight
- **Body**: Regular (400) weight

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend Issues

- **Migration errors**: Run `python manage.py migrate --run-syncdb`
- **CORS errors**: Ensure `corsheaders` is in `INSTALLED_APPS` and `CORS_ALLOWED_ORIGINS` includes your frontend URL
- **Email not sending**: Check email backend configuration (console backend for development)

### Frontend Issues

- **API connection errors**: Verify backend is running and `VITE_API_BASE_URL` is correct
- **Build errors**: Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- **Type errors**: Run `npm run lint` to check for TypeScript issues

## License

This project is proprietary software for Afri Cleans.

## Support

For issues or questions, please contact the development team.

