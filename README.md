# Car Rental Booking System

A full-stack car rental booking application built with **Spring Boot** (backend) and **React + Redux + TypeScript** (frontend), featuring internationalization, responsive design, and production-ready best practices.

## 🚀 Features

- **Vehicle Selection**: Choose from multiple vehicle types (Sedan, SUV, Luxury, Van)
- **Date Selection**: Pick-up and drop-off date selection with validation
- **Vehicle-Specific Add-ons**: Different add-ons available based on selected vehicle (Premium vehicles have more options)
- **Add-ons Selection**: Select multiple add-ons (GPS, Child Seat, WiFi, Driver Service, Insurance, etc.)
- **Real-time Cost Calculation**: Dynamic calculation with base cost, add-ons, and GST (18%)
- **Booking Confirmation**: Animated confirmation popup with booking details
- **Internationalization**: Support for English, Hindi, and Spanish
- **Responsive Design**: Mobile-friendly UI that works on all devices
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Loading States**: Loading spinners for async operations

## 📋 Prerequisites

- **Java 21** or higher
- **Node.js 18+** and **npm** or **yarn**
- **Maven 3.6+** (for backend)

## 🛠️ Setup Instructions

> **💡 Quick Start**: The application works out-of-the-box with default configurations. No environment files or configuration changes are required for local development!

### Backend Setup

1. Navigate to the backend directory (root of the project):
   ```bash
   cd bookingservice
   ```

2. Build the project:
   ```bash
   ./mvnw clean install
   ```
   (On Windows: `mvnw.cmd clean install`)

3. Run the Spring Boot application:
   ```bash
   # Development mode (default - no configuration needed)
   ./mvnw spring-boot:run
   ```
   (On Windows: `mvnw.cmd spring-boot:run`)
   
   **Production mode:**
   ```bash
   # PowerShell
   mvn spring-boot:run "-Dspring-boot.run.profiles=prod"
   
   # Bash
   mvn spring-boot:run -Dspring-boot.run.profiles=prod
   ```

4. The backend will start on `http://localhost:8000`

5. Verify the API endpoints:
   - `http://localhost:8000/api/v1/vehicles`
   - `http://localhost:8000/api/v1/addons`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   **Note:** 
   - No `.env` file needed! The frontend defaults to `http://localhost:8000/api/v1`
   - If you need to customize the API URL, see `frontend/.env.example` for reference
   - The `.env` file is gitignored and should not be committed to version control

4. The frontend will start on `http://localhost:5173`

5. Open your browser and navigate to `http://localhost:5173`

### Additional Frontend Commands

- **Lint code**: `npm run lint`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## 📁 Project Structure

```
bookingservice/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/carrental/bookingservice/
│   │   │       ├── config/          # Security and CORS configuration
│   │   │       ├── controller/     # REST controllers
│   │   │       ├── exception/       # Global exception handler
│   │   │       ├── model/           # Data models
│   │   │       └── service/         # Business logic
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── logback-spring.xml
│   └── test/
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── i18n/                    # Internationalization config
│   │   │   └── locales/            # Translation files (en, hi, es)
│   │   ├── services/               # API service with caching
│   │   ├── store/                  # Redux store and slices
│   │   ├── styles/                 # Utility CSS classes
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Utility functions (translations)
│   │   ├── App.tsx
│   │   ├── App.module.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── eslint.config.js
└── README.md
```

## 🎯 API Endpoints

### GET `/api/v1/vehicles`
Returns a list of available vehicle types.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Sedan",
    "emoji": "🚗",
    "costPerDay": 2500.0
  },
  ...
]
```

### GET `/api/v1/addons`
Returns a list of available add-ons for a specific vehicle.

**Query Parameters:**
- `vehicleId` (optional): Vehicle ID to get vehicle-specific addons

**Examples:**
- `GET /api/v1/addons` - Returns basic addons
- `GET /api/v1/addons?vehicleId=1` - Returns addons for Sedan (ID: 1)
- `GET /api/v1/addons?vehicleId=3` - Returns addons for Luxury (ID: 3)

**Response:**
```json
[
  {
    "id": 1,
    "name": "GPS Navigation",
    "costPerDay": 200.0
  },
  ...
]
```

**Addon Availability by Vehicle:**
- **Sedan (ID: 1)**: Basic addons only (GPS Navigation, Child Seat, Insurance, Roadside Assistance)
- **SUV (ID: 2) & Van (ID: 4)**: Basic + WiFi Hotspot
- **Luxury (ID: 3)**: All addons including premium options (Driver Service, Premium Insurance, Concierge Service, Chauffeur Service, Premium Sound System)

## 💰 Cost Calculation Formula

- **Base Cost** = Vehicle Cost Per Day × Number of Days
- **Add-ons Cost** = Σ(Add-on Cost Per Day × Number of Days)
- **Subtotal** = Base Cost + Add-ons Cost
- **GST (18%)** = Subtotal × 0.18
- **Total Amount** = Subtotal + GST

## ✅ Validation Rules

1. **Vehicle Selection**: Must select a vehicle before accessing add-ons
2. **Date Selection**: 
   - Both pickup and drop-off dates are required
   - Drop-off date must be after pickup date
   - Minimum 1 rental day required
3. **Booking Button**: Enabled only when all validations pass

## 🌐 Internationalization

The application supports three languages:
- **English (en)** - Default
- **Hindi (hi)** - हिंदी
- **Spanish (es)** - Español

Use the language switcher in the header to change languages.

## 🎨 Styling

- **CSS Modules** for component-scoped styling
- **CSS Variables** for theming
- **BEM Convention** for class naming
- **Responsive Design** with mobile-first approach
- **Gradient Headers** for visual appeal

## 🧪 Development

### Backend
- Spring Boot 3.5.7
- Java 21
- Maven for dependency management
- H2 Database (configured but not used for mock data)

### Frontend
- React 18.2
- TypeScript 5.6
- Redux Toolkit 2.0
- Vite 6.0
- ESLint 9.0
- Axios for API calls
- react-i18next for internationalization

## 🚨 Error Handling

- **Error Boundary**: Catches React component errors
- **API Error Handling**: Axios interceptors for request/response errors
- **User-friendly Error Messages**: Displayed with retry options
- **Loading States**: Spinners during async operations

## 📱 Responsive Design

The application is fully responsive and works on:
- **Mobile** (< 768px)
- **Tablet** (768px - 1024px)
- **Desktop** (> 1024px)

## 🔒 Security

- **CORS Configuration**: Configured for frontend origin (configurable via `FRONTEND_ORIGIN` environment variable)
- **Production Security**: 
  - Sensitive data sanitization in logs
  - Generic error messages in production (no stack traces exposed)
  - H2 console disabled in production
  - Security headers enabled (Frame Options, CSP)
- **Input Validation**: Date fields validation
- **XSS Protection**: React's built-in escaping
- **Environment-aware Logging**: Different log levels for development vs production

## 📝 Assumptions

1. **Currency**: Indian Rupee (₹) is used as the default currency
2. **GST Rate**: Fixed at 18% for all bookings
3. **Date Format**: DD/MM/YYYY format for display
4. **API Base URL**: 
   - Default: `http://localhost:8000/api/v1` (no configuration needed)
   - Configurable via `VITE_API_BASE_URL` environment variable (optional)
5. **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
6. **Vehicle IDs**: 
   - 1 = Sedan
   - 2 = SUV
   - 3 = Luxury
   - 4 = Van

## ⚙️ Configuration Files

### Environment Variables (Optional)

The application works out-of-the-box with sensible defaults for local development. Configuration files are **optional** unless you need to customize settings.

**Backend Environment Variables** (`.env` in root - optional):
- `FRONTEND_ORIGIN`: Frontend URL for CORS (default: `http://localhost:5173`)
- `SPRING_PROFILES_ACTIVE`: Spring profile (default: `dev`)

**Frontend Environment Variables** (`frontend/.env` - optional):
- `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:8000/api/v1`)

**Example files:**
- See `.env.example` in root directory for backend environment variables
- See `frontend/.env.example` for frontend environment variables

### Application Properties

- **Default**: `src/main/resources/application.properties` (works out of the box)
- **Development**: `src/main/resources/application-dev.properties` (auto-loaded with `dev` profile)
- **Production**: `src/main/resources/application-prod.properties` (auto-loaded with `prod` profile)

No changes needed to property files for local development.

## 🐛 Troubleshooting

### Backend Issues

1. **Port 8000 already in use**:
   - Change `server.port` in `application.properties`
   - Update frontend `.env` file accordingly

2. **Maven build fails**:
   - Ensure Java 21 is installed: `java -version`
   - Clear Maven cache: `./mvnw clean`

### Frontend Issues

1. **API connection errors**:
   - Ensure backend is running on port 8000
   - If using `.env` file, verify it has correct API URL (default: `http://localhost:8000/api/v1`)
   - Verify CORS configuration in backend (defaults to `http://localhost:5173`)

2. **Dependencies not installing**:
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

3. **TypeScript errors**:
   - Run `npm run build` to check for type errors
   - Ensure all dependencies are installed

## 📄 License

This project is for educational/demonstration purposes.

## 👨‍💻 Development Notes

- All components are functional components using React Hooks
- Redux Toolkit is used for state management
- TypeScript provides type safety throughout
- CSS Modules prevent style conflicts
- Error boundaries catch and handle React errors gracefully
- Loading states improve user experience
- Internationalization makes the app accessible to multiple languages

## 🎯 Stretch Goals Completed

All stretch goals for advanced date validation have been implemented:

### ✅ Advanced Date Validation

1. **Disabled Drop-off Date Picker Until Pick-up Date Selected**
   - Drop-off date input is disabled until a pick-up date is selected
   - Ensures proper data entry flow

2. **Restricted Drop-off Date Selection**
   - HTML5 `min` attribute dynamically set to (pick-up date + 1 day)
   - Users cannot select dates before or equal to pick-up date
   - Minimum rental period of 1 day enforced

3. **Handled Pick-up Date Changes**
   - When pick-up date changes and new date is after current drop-off date → drop-off date is automatically cleared
   - When pick-up date changes and new date is before current drop-off date → drop-off date remains unchanged
   - Real-time validation ensures data consistency

### Implementation Details

- Uses HTML5 date input attributes (`min`, `disabled`) for native browser validation
- React state management ensures proper synchronization
- Validation errors displayed in real-time
- Past dates are prevented from being selected
- Timezone-aware date handling to avoid UTC conversion issues

## 🎉 Ready to Use

The application is production-ready with:
- ✅ Clean code architecture
- ✅ Type safety with TypeScript
- ✅ Error handling and boundaries
- ✅ Loading and error states
- ✅ Responsive design
- ✅ Internationalization
- ✅ Accessible UI components
- ✅ Comprehensive validation
- ✅ Vehicle-specific addons
- ✅ Production security hardening
- ✅ Enhanced UI animations
- ✅ Environment-aware configuration
- ✅ **All stretch goals completed**

## 🚀 Production Deployment

### Backend Production Setup

1. Set environment variables:
   ```bash
   export SPRING_PROFILES_ACTIVE=prod
   export FRONTEND_ORIGIN=https://your-frontend-domain.com
   ```

2. Run with production profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=prod
   ```

### Frontend Production Setup

1. Create `.env.production` file:
   ```env
   VITE_API_BASE_URL=https://api.your-backend-domain.com/api/v1
   ```

2. Build for production:
   ```bash
   npm run build:prod
   ```

3. Deploy the `dist/` folder to your hosting provider

### Important Notes

- **CORS**: Update `FRONTEND_ORIGIN` environment variable in production
- **API URL**: Update `VITE_API_BASE_URL` in frontend `.env.production`
- **Security**: Production profile automatically:
  - Disables H2 console
  - Sanitizes sensitive data in logs
  - Uses generic error messages
  - Enables security headersAdded setup note for PR
