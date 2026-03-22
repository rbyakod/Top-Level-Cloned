# Tech Stack

## Context

Global tech stack defaults for Agent OS projects, overridable in project-specific `.agent-os/product/tech-stack.md`.

## Core Technologies

**Runtime & Language**
- **Language** TypeScript (primary), JavaScript
- **Node Version** 24 LTS
- **Package Manager** npm (pnpm for monorepos)

**Frontend Stack**
- **Web Framework** Next.js (latest stable)
- **Mobile Framework** React Native with Expo managed workflow
- **CSS Framework** TailwindCSS
- **UI Components** Shadcn/ui (web), React Native components (mobile)
- **Icons** Lucide React components

**Backend Stack**
- **Framework** [TO BE SPECIFIED PER PROJECT]
- **API Style** RESTful APIs
- **Authentication** [TO BE SPECIFIED PER PROJECT]

**Database & Storage**
- **Primary Database** PostgreSQL 17+
- **ORM** Prisma
- **Database Provider** [TO BE SPECIFIED PER PROJECT]
- **File Storage** [TO BE SPECIFIED PER PROJECT]

## Architecture Patterns

**Application Architecture**
- **Monolithic** → Single codebase deployments for teams <5 developers
- **Microservices** → Multi-service architecture for teams >5 developers
- **Shared Logic** → Organize shared business logic in packages/ directory

**Project Structure**
```
monorepo/
├── apps/
│   ├── web/          # Next.js application
│   └── mobile/       # React Native + Expo
├── packages/
│   ├── ui/           # Shared components
│   ├── database/     # Prisma schema & client
│   └── api/          # Shared API logic
└── services/         # Microservices (if applicable)
```

## Infrastructure & Hosting

**Application Hosting**
- **Platform** [TO BE SPECIFIED PER PROJECT]
- **Region Selection** Based on user geographic distribution

**Database Hosting**
- Managed through selected database provider
- **Backup Strategy** Automated via provider

**CDN & Assets**
- Platform-integrated CDN
- **Mobile Assets** Expo Updates for over-the-air updates

## Development & Deployment

**Version Control**
- **Git** with GitHub
- **Branch Strategy** main (production) + staging + feature branches

**CI/CD**
- **Platform** GitHub Actions
- **Triggers** Push to main/staging branches
- **Pipeline** Test → Build → Deploy
- **Container Strategy** [TO BE SPECIFIED PER PROJECT]

**Testing Strategy**
- **Unit Tests** Jest + React Testing Library
- **Integration Tests** Supertest (API), Cypress (E2E)
- **Mobile Testing** Jest + React Native Testing Library
- **Database Testing** Prisma with test database

**Development Tools**
- **IDE** Claude Code, Cursor, VS Code
- **Database Admin** Prisma Studio
- **API Testing** Thunder Client, Postman
- **Mobile Development** Expo CLI, React Native Debugger

## Security Standards

**Authentication**
- JWT tokens with secure httpOnly cookies
- OAuth integration (Google, GitHub, Apple)
- Multi-factor authentication for admin roles

**API Security**
- Rate limiting (express-rate-limit)
- Input validation (Zod schemas)
- CORS configuration
- API versioning (/api/v1/)

**Database Security**
- Row-level security (RLS) when supported
- Environment-based connection strings
- Encrypted connections (SSL/TLS)
- Regular security updates

## Performance Optimization

**Frontend Performance**
- Code splitting with dynamic imports
- Image optimization (Next.js Image, Expo Image)
- Bundle analysis and optimization
- Progressive Web App features

**Backend Performance**
- Database query optimization
- Caching strategy (Redis when needed)
- Connection pooling
- API response compression

**Mobile Performance**
- Bundle size optimization
- Native module usage when appropriate
- Offline-first architecture
- Performance monitoring

## Monitoring & Analytics

**Application Monitoring**
- **Error Tracking** Sentry
- **Performance** Native platform tools
- **Uptime** Provider monitoring

**Database Monitoring**
- Provider-native monitoring
- Query performance analysis
- Connection pool monitoring

## Focus Areas

- Microservice application architecture patterns
- PostgreSQL database optimization and query performance
- React/Next.js frontend development with server-side rendering
- React Native/Expo mobile development with cross-platform code sharing
- Node.js/Express/NestJS backend architecture and API design
- Database integration patterns (Convex, Supabase, NeonDB)
- Cloud infrastructure deployment and scaling
- AI technologies integration and agentic AI systems
- RAG (Retrieval-Augmented Generation) implementations
- No-code/Low-code automation platform integrations

## Development Environment

- **AI-Augmented IDEs** Claude Code, Cursor with Agent OS integration
- **JavaScript/TypeScript Tools** ESLint, Prettier, TypeScript compiler
- **React Development** React Developer Tools, Next.js DevTools
- **Mobile Development** Expo CLI, React Native Debugger, Flipper
- **Database Management** Prisma Studio, PostgreSQL administration tools
- **API Development** Thunder Client, Postman for API testing

## INTERACTION PREFERENCES

**Technical Communication Standards**
- Present solutions exclusively within TypeScript/JavaScript ecosystem
- Reference modern TypeScript patterns, ES2023+ features, and type-safe implementations
- Leverage Prisma ORM capabilities for database operations and type generation
- Apply React/Next.js patterns for web and React Native patterns for mobile
- Include Node.js integration patterns for AI technologies and APIs

**Architectural Approach**
- Follow Node.js architectural patterns: MVC, microservices, RESTful APIs
- Implement Prisma schema design and migration strategies
- Optimize for cross-platform performance (web + mobile)
- Apply modern TypeScript/JavaScript security best practices
- Structure shared business logic for code reusability across platforms

**Solution Methodology**
- Prioritize TypeScript/JavaScript native solutions over external dependencies
- Recommend npm packages only when they significantly improve development efficiency
- Use modern testing frameworks: Jest, React Testing Library, Detox for React Native
- Apply deployment patterns optimized for the specified hosting platform
- Emphasize TypeScript for type safety and developer experience enhancement
- Balance web and mobile development considerations in all implementations

**Implementation Standards**
- **Backend Development** Node.js with Express or NestJS + Prisma ORM
- **Frontend Development** Next.js with React + TailwindCSS + Shadcn/ui
- **Mobile Development** React Native with Expo managed workflow
- **Database Integration** PostgreSQL via specified provider with Prisma client
- **CI/CD Implementation** GitHub Actions for JavaScript/TypeScript workflows
- **Testing Strategy** Jest ecosystem with framework-specific testing utilities

**Project Planning Integration**
- Structure features as full-stack modules (web + mobile + API)
- Map user stories to API endpoints and component implementations
- Plan development tasks considering cross-platform code sharing opportunities
- Include database schema evolution in technical roadmaps
- Design deployment strategies for both web and mobile applications
- Architect shared business logic patterns between platform implementations

## RESPONSE STYLE

**Communication Format**
- Provide direct, actionable JavaScript/TypeScript architectural solutions
- Include both Next.js frontend and React Native mobile perspectives in responses
- Reference PostgreSQL optimization techniques through Prisma queries
- Suggest relevant npm packages with specific version ranges and justifications
- Balance implementation approaches between web and mobile platforms

**Code Implementation Guidelines**  
- Generate step-by-step TypeScript/JavaScript development instructions
- Include error handling and edge case considerations
- Reference modern JavaScript community best practices and patterns
- Provide cross-platform code sharing strategies and implementation examples
- Include performance optimization recommendations for both web and mobile

**Technical Standards**
- Follow modern TypeScript/JavaScript conventions and ES2023+ features
- Leverage Prisma type safety for database operations and schema management
- Implement PostgreSQL performance optimizations through the selected provider
- Ensure seamless integration across React ecosystem (Next.js + React Native)
- Utilize Expo managed workflow capabilities for mobile development efficiency
- Apply modern security standards and vulnerability prevention practices
- Design scalable full-stack JavaScript architecture patterns
- Balance user experience considerations across web and mobile platforms