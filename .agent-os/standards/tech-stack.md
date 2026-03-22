# Tech Stack

## Context

Global tech stack defaults for Agent OS projects, overridable in project-specific `.agent-os/product/tech-stack.md`.

**Primary Tech Stack**
- **Frontend Framework** Next.js (latest stable)
- **Backend Framework** Node.js, Express, NestJS (latest stable)
- **Mobile Framework** React Native with Expo
- **Language** TypeScript, JavaScript
- **Package Manager** npm (pnpm, or npx when needed or required)
- **Node Version** 22 LTS

**Database & ORM**
- **Primary Database** PostgreSQL 17+ (latest stable)
- **ORM** Prisma
- **Database Hosting** Convex or Supabase or Neon DB
- **Backup Strategy** Automated via the selected provider

**Frontend & Styling**
- **CSS Framework** TailwindCSS
- **UI Components** Shadcn/ui
- **Mobile UI** React Native components with Expo
- **Font Loading** Optimized for web and mobile performance
- **Icons** Lucide React components

**Infrastructure & Hosting**
- **Application Hosting** Digital Ocean App Platform/Droplet or Hetzner Cloud
- **Hosting Region** Primary region based on user base
- **Database** Provider managed infrastructure
- **Asset Storage** Integrated with hosting platform
- **CDN** Optimized delivery for web and mobile

**Development & Deployment**
- **CI/CD Platform** GitHub Actions
- **CI/CD Trigger** Push to main/staging branches
- **Version Control** Git (GitHub)
- **Testing** Jest, React Testing Library, Expo testing tools
- **Production Environment** main branch
- **Staging Environment** staging branch
- **Container Management** Docker for all the microservices

**Focus Areas**
- Microservice application architecture patterns
- PostgreSQL database optimization
- React/Next.js frontend development
- React Native/Expo mobile development
- Node.js/Express/NestJS backend architecture
- Convex, supabase, NeonDB database integration
- Digital Ocean infrastructure
- AI technologies integration
- Agentic AI and RAG systems
- No-code/Low-code automation platforms

**Development Environment** 
- Modern AI-augmented IDEs (Claude Code, Cursor)
- JavaScript/TypeScript development tools
- React Developer Tools
- Expo development tools
- PostgreSQL administration tools
- Prisma Studio for database management

## INTERACTION PREFERENCES

**Technical Communications**
- Present solutions within TypeScript/JavaScript ecosystem
- Frame explanations around modern TypeScript patterns and best practices
- Consider Prisma ORM capabilities and Convex integration
- Reference React/Next.js and React Native patterns
- Include AI integration possibilities using Node.js patterns

**Architecture Considerations**
- Follow Node.js architectural patterns (MVC, microservices, RESTful APIs)
- Leverage Prisma schema and type generation
- Consider web and mobile performance optimization techniques
- Include Prisma migration strategies and Convex sync patterns
- Address modern TypeScript, JavaScript security best practices
- Consider web code sharing and React Native strategies

**Solution Approach**
- Prioritize TypeScript/JavaScript native solutions
- Include npm package recommendations when appropriate
- Consider modern testing frameworks (Jest, React Testing Library, Detox for RN)
- Address Node.js deployment patterns on Digital Ocean
- Emphasize TypeScript for type safety and developer experience
- Balance web and mobile development considerations

**Tool-Specific Considerations**
- **Backend** Node.js, Express or NestJS with Prisma ORM
- **Frontend** Next.js with React and TailwindCSS
- **Mobile** React Native with Expo managed workflow
- **Database** PostgreSQL via Convex, Supabase or NeonDB with Prisma client
- **UI Components** Shadcn/ui for web, React Native components for mobile
- **Infrastructure** Digital Ocean for application hosting or Hetzner Cloud
- **CI/CD** GitHub Actions for JavaScript/TypeScript workflows
- **Testing** Jest ecosystem with framework-specific tools

**Planning and Project Management**
- Structure epics around feature modules (web + mobile)
- Define user stories with API endpoint and component mapping
- Break down tasks considering cross-platform development
- Include Prisma schema evolution in roadmaps
- Consider deployment strategies for web and mobile apps
- Plan for shared business logic between platforms

**Microsoft Application Architecture Integration**
- Consider Azure services when Microsoft ecosystem integration required
- Plan for Microsoft Graph API integrations
- Address Microsoft authentication patterns (Azure AD)
- Include Office 365 integration considerations

## RESPONSE STYLE

- Direct and modern JavaScript-focused architectural solutions
- Include both frontend (Next.js) and mobile (React Native) perspectives
- Address PostgreSQL optimization via Prisma and Convex
- Proactively suggest relevant npm packages and patterns
- Balance web and mobile development approaches
- Provide step-by-step JavaScript/TypeScript development instructions
- Consider Digital Ocean or Hetzner Cloud and Convex or Supabase or NeonDB deployment implications
- Reference modern JavaScript community best practices
- Include cross-platform code sharing strategies

**Key Principles**
- Follow modern JavaScript/TypeScript conventions
- Leverage Prisma type safety and database patterns
- Optimize for PostgreSQL performance via Convex, Supabase or NeonDB
- Integrate seamlessly across React ecosystem (Next.js + React Native)
- Consider Expo managed workflow benefits
- Maintain modern security standards
- Plan for scalable full-stack JavaScript architecture
- Balance web and mobile user experience considerations
