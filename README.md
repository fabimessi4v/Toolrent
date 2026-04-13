# Toolrent - Tool Rental Management System

## Description
Toolrent is a comprehensive full-stack application designed for managing tool rental operations. The system provides complete control over inventory, customer management, loan tracking, and automated fee calculations. It features role-based access control, real-time inventory updates, and detailed reporting capabilities for efficient rental business management.

## Technologies Used

### Backend
- **Java 17** with **Spring Boot 3.3.5**
- **MySQL 8.0** database with JPA/Hibernate
- **Keycloak 20.0.3** for SSO authentication and authorization
- **JWT** tokens for secure API communication
- **Spring Security** with OAuth2 resource server
- **SpringDoc OpenAPI** for API documentation
- **Gradle** build system with Jacoco test coverage
- **SonarQube** for code quality analysis

### Frontend
- **React 19** with **Vite** build tool
- **Tailwind CSS 3.4** for responsive styling
- **shadcn/ui** component library
- **Keycloak JS** for frontend authentication
- **Axios** for HTTP requests
- **React Router DOM 7.8** for navigation
- **Radix UI** primitives for accessible components

### DevOps & Testing
- **Docker Compose** for containerizing and orchestrating the frontend, backend, database, and Keycloak services
- **Selenium IDE** for automated functional testing
- **MySQL Workbench** for database management
- **k6** for performance testing, including load, stress, and volume tests
- **GitHub Actions** for CI/CD pipeline automation, deploying to a QA virtual machine where testing was conducted
## Features

### 🔐 Authentication & Authorization
- **Keycloak SSO integration** with centralized user management
- **Role-based access control** (Admin, Employee roles)
- **JWT token authentication** for secure API calls

### 🛠️ Tool Management
- **Complete inventory control** with tool categorization
- **Stock tracking** with real-time availability updates
- **Tool status management** (Available, Rented, Under Maintenance, Decommissioned)
- **Automatic stock adjustment** on rentals and returns
- **Tool ranking** by popularity and usage frequency

### 👥 Customer Management
- **Customer registration** with RUT (Chilean ID) validation
- **Contact information** and communication history
- **Debt tracking** with automated penalty calculations
- **Loan limit enforcement** (max 5 simultaneous loans per customer)
- **Customer blacklisting** for overdue payments

### 📋 Loan & Rental System
- **Automated loan creation** with validation rules
- **Real-time availability checking** before loan approval
- **Automated fee calculations** based on tool rates
- **Late return penalties** with configurable rates
- **Damage assessment** and replacement cost calculations
- **Unique tool restriction** (one unit per tool type per customer)

### 📊 Kardex & Inventory Tracking
- **Complete audit trail** of all inventory movements
- **Real-time stock updates** on every transaction
- **Movement categorization** (Entry, Exit, Adjustment, Return)
- **Historical data** for reporting and analysis

### 📈 Reports & Analytics
- **Active loans dashboard** with overdue highlights
- **Customer delinquency reports**
- **Tool popularity rankings**
- **Financial reports** with revenue calculations
- **Custom date range filtering** for all reports

### ⚙️ System Configuration
- **Rate management** for different tool categories
- **Penalty configuration** for late returns
- **System parameters** for business rules
- **Role permissions** customization

## What I Learned

### Technical Skills
- **Full-stack development** with modern Java/React technology stack
- **Keycloak SSO integration** and role-based access control implementation
- **Complex business logic** for rental systems including automated fee calculations
- **Docker containerization** for both frontend and backend applications
- **API design** with RESTful principles and proper error handling
- **Database design** for inventory management systems with audit trails

### Development Practices
- **Test-driven development** with comprehensive functional testing
- **Selenium IDE automation** for UI testing scenarios
- **Performance testing** methodologies (load, stress, volume tests)
- **Code quality analysis** with SonarQube integration
- **CI/CD pipeline**  implemented with GitHub Actions and Docker Compose
- **Security best practices** for authentication and authorization

### Business Domain Knowledge
- **Inventory management** principles for rental businesses
- **Financial calculations** for rental fees and penalties
- **Customer relationship management** for service-based businesses
- **Reporting requirements** for operational decision-making

## Possible Improvements

### 🚀 Feature Enhancements
- **Mobile application** for field technicians and customers
- **Real-time notifications** via email/SMS for due dates and penalties
- **Barcode/QR code scanning** for quick tool check-in/check-out
- **Advanced analytics dashboard** with predictive insights
- **Integration with payment gateways** for online payments
- **Multi-location support** for franchise operations

### 🔧 Technical Improvements
- **Microservices architecture** for better scalability
- **GraphQL API** for more efficient data fetching
- **Real-time updates** with WebSocket connections
- **Advanced search** with elasticsearch integration
- **Caching layer** for improved performance
- **Automated backup** and disaster recovery procedures

### 📱 User Experience
- **Progressive Web App (PWA)** capabilities
- **Offline mode** for field operations
- **Multi-language support** for international expansion
- **Accessibility improvements** for compliance
- **Dark mode** theme option

## How to Run the Project

### Prerequisites
- **Java 17** or higher
- **Node.js 20** or higher
- **MySQL 8.0** database
- **Docker** and **Docker Compose**
- **Keycloak 20.0.3** (or use Docker)

### Quick Start with Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/toolrent.git
   cd toolrent
   ```

2. **Start the database and Keycloak:**
   ```bash
   docker-compose up -d mysql keycloak
   ```

3. **Initialize the database:**
   ```bash
   mysql -u root -p < bd/backup_toolrentdb.sql
   ```

4. **Import Keycloak realm:**
   - Access Keycloak at `http://localhost:8080`
   - Login with admin/admin
   - Import `keycloak/realm-export.json`

5. **Build and run the backend:**
   ```bash
   cd Backend/demo
   ./gradlew bootRun
   ```

6. **Build and run the frontend:**
   ```bash
   cd Frontend/toolrent
   npm install
   npm run dev
   ```

### Development Setup

#### Backend Configuration
1. **Create environment file:**
   ```bash
   cp Backend/demo/.env.example Backend/demo/.env
   ```
2. **Update `.env` with your database and Keycloak settings**

3. **Run tests:**
   ```bash
   cd Backend/demo
   ./gradlew test
   ```

#### Frontend Configuration
1. **Create environment file:**
   ```bash
   cd Frontend/toolrent
   cp .env.example .env.development
   ```

2. **Update environment variables:**
   ```
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_KEYCLOAK_URL=http://localhost:8080
   VITE_KEYCLOAK_REALM=toolrent
   VITE_KEYCLOAK_CLIENT_ID=toolrent-frontend
   VITE_USE_MOCK_DATA=false
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Production Deployment with Docker Compose

The project includes a complete production-ready Docker Compose setup in the `/deploy` folder. This configuration orchestrates all services: backend, frontend, database, Keycloak authentication, and Nginx reverse proxy with SSL.

### Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.20+)
- **Docker Hub account** (optional, only if using pre-built images)
- **SSL certificates** (pre-configured and included in `deploy/nginx/certs/`; update as needed for your domain or environment)

**Note on Docker Images**: The deployment expects Docker Hub images at `${DOCKER_USERNAME}/toolrent-app:latest` and `${DOCKER_USERNAME}/toolrent-front:latest`. If these images are not publicly available, you have three options:

1. **Build and push your own images** to your Docker Hub account (see instructions below)
2. **Use local images** by modifying the `docker-compose.yml` (see Customization section)
3. **Build and use images locally** without Docker Hub

### Building Docker Images Locally

If you don't have access to the pre-built Docker Hub images, you can build them locally:

#### Build Backend Image:
```bash
cd Backend/demo
docker build -t toolrent-app:latest .
```

#### Build Frontend Image:
```bash
cd Frontend
docker build \
  --build-arg VITE_API_BASE_URL=https://192.168.122.17/api/v1 \
  --build-arg VITE_KEYCLOAK_URL=https://192.168.122.17 \
  --build-arg VITE_KEYCLOAK_REALM=toolrent \
  --build-arg VITE_KEYCLOAK_CLIENT_ID=toolrent-frontend \
  --build-arg VITE_USE_MOCK_DATA=false \
  -t toolrent-front:latest .
```

#### Update docker-compose.yml to use local images:
```yaml
services:
  app-toolrent:
    image: toolrent-app:latest  # Changed from ${DOCKER_USERNAME}/toolrent-app:latest
    # ... rest of configuration
  
  front-toolrent:
    image: toolrent-front:latest  # Changed from ${DOCKER_USERNAME}/toolrent-front:latest
    # ... rest of configuration
```

### Environment Setup

1. **Navigate to the deploy folder:**
   ```bash
   cd deploy
   ```

2. **Create environment file from example:**
   ```bash
   cp .env.example .env
   ```

3. **Edit the `.env` file with your configuration:**
   ```bash
   nano .env
   ```

   Required variables:
   ```env
   # Docker Hub Configuration
   # Replace with your Docker Hub username
   DOCKER_USERNAME=yourdockerhubusername
   
   # Database Configuration
   DB_USER=toolrent
   DB_PASSWORD=your_secure_password_here
   DB_DRIVER=com.mysql.cj.jdbc.Driver
   
   # Spring Application Configuration
   SPRING_APPLICATION_NAME=demo
   ```





## Demo Video
https://github.com/user-attachments/assets/ddef39f8-4d9a-4d6e-a90c-1e16c5ee30a4

---

## Project Structure
```
Toolrent/
├── Backend/                 # Spring Boot application
│   ├── demo/               # Main backend module
│   │   ├── src/main/java/  # Source code
│   │   ├── src/test/java/  # Unit tests
│   │   └── build.gradle    # Build configuration
├── Frontend/               # React application
│   └── toolrent/           # Main frontend module
│       ├── src/            # React components and logic
│       ├── public/         # Static assets
│       └── package.json    # Dependencies
├── bd/                     # Database scripts and backups
├── deploy/                  # Production Docker Compose deployment
│   ├── docker-compose.yml  # Multi-service orchestration
│   ├── .env.example        # Environment variables template
│   ├── test-deployment.sh  # Deployment validation script
│   ├── bd/                 # Database initialization scripts
│   ├── nginx/              # Reverse proxy configuration
│   │   ├── conf/           # Nginx configuration files
│   │   └── certs/          # SSL certificates
│   └── keycloak/           # Keycloak realm configuration
├── docs/                   # Documentation and tests
├── keycloak/               # Keycloak configuration (development)
└── README.md               # This file
```

## Testing
The project includes comprehensive testing:
- **Unit tests** with JUnit and Mockito
- **Integration tests** for API endpoints
- **Functional tests** with Selenium IDE (50% automated)
- **Performance tests** (load, stress, volume)
- **Code coverage** with Jacoco (target: 80%+)

Run all tests:
```bash
cd Backend/demo
./gradlew test jacocoTestReport
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.

## Support
For issues and feature requests, please use the [GitHub Issues](https://github.com/yourusername/toolrent/issues) page.

---

*Last updated: April 13, 2026*
