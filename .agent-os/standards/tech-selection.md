# Technology Selection Standards

## Core Philosophy
**Choose boring technology that lets you ship fast and serve users well.**

## The Selection Framework

### Primary Decision Criteria (Weighted)
```yaml
criteria_weights:
  shipping_speed: 40%        # How fast can we build and ship?
  user_experience: 30%       # How does this affect users?
  team_expertise: 20%        # Can our team maintain this?
  future_flexibility: 10%    # Can we change this later?
```

### Decision Process
1. **Identify Options** (5 minutes max)
2. **Score Each Option** against criteria
3. **Choose Highest Score** 
4. **Document Decision** with rationale
5. **Ship and Learn** - iterate if needed

## Technology Categories & Defaults

### Frontend Framework Selection
```yaml
# Default Choice: Next.js
next_js:
  shipping_speed: 9/10      # Fast development, great DX
  user_experience: 9/10     # Excellent performance, SEO
  team_expertise: 8/10      # Well-documented, popular
  future_flexibility: 8/10  # Can migrate incrementally
  
# Alternative: Pure React
react_spa:
  shipping_speed: 7/10      # Good development speed
  user_experience: 7/10     # Good but needs more config
  team_expertise: 9/10      # Most familiar
  future_flexibility: 9/10  # Maximum control
  
# Avoid: New frameworks
new_framework:
  shipping_speed: 3/10      # Learning curve
  user_experience: ?/10     # Unknown performance
  team_expertise: 2/10      # No team knowledge
  future_flexibility: 5/10  # Unknown migration path

recommendation: "Use Next.js for new projects, migrate existing React gradually"
```

### Backend Framework Selection
```yaml
# Default Choice: Node.js + Express
node_express:
  shipping_speed: 9/10      # Same language as frontend
  user_experience: 8/10     # Fast JSON APIs
  team_expertise: 9/10      # Team knows JavaScript
  future_flexibility: 9/10  # Easy to refactor/scale
  
# Alternative: Node.js + Fastify
node_fastify:
  shipping_speed: 8/10      # Slightly more setup
  user_experience: 9/10     # Better performance
  team_expertise: 7/10      # Less familiar API
  future_flexibility: 8/10  # Good but different patterns
  
# Avoid: Different languages
python_flask:
  shipping_speed: 5/10      # Context switching
  user_experience: 8/10     # Good performance
  team_expertise: 4/10      # Team learning curve
  future_flexibility: 6/10  # Separate deployment/tooling

recommendation: "Node.js + Express for consistency and speed"
```

### Database Selection
```yaml
# Default Choice: PostgreSQL + Prisma
postgresql_prisma:
  shipping_speed: 9/10      # Prisma speeds development
  user_experience: 9/10     # Reliable, fast queries
  team_expertise: 8/10      # Well-documented ORM
  future_flexibility: 9/10  # Can optimize later
  
# Alternative: SQLite (for simple apps)
sqlite:
  shipping_speed: 10/10     # Zero setup
  user_experience: 7/10     # Good for <10k users
  team_expertise: 9/10      # Simple to understand
  future_flexibility: 6/10  # Migration needed for scale
  
# Avoid: NoSQL for CRUD apps
mongodb:
  shipping_speed: 6/10      # Flexible but complex relations
  user_experience: 7/10     # Can be fast
  team_expertise: 5/10      # Different mental model
  future_flexibility: 7/10  # Schema flexibility vs consistency

recommendation: "PostgreSQL + Prisma for most apps, SQLite for MVPs"
```

## Hosting & Infrastructure Defaults

### Application Hosting
```yaml
# Default Choice: Vercel (Frontend) + Railway (Backend)
vercel_railway:
  shipping_speed: 10/10     # Git push to deploy
  user_experience: 9/10     # Global CDN, fast loading
  team_expertise: 8/10      # Simple configuration
  future_flexibility: 8/10  # Can migrate when needed
  cost_efficiency: 8/10     # Generous free tiers
  
# Alternative: Single Platform (Railway Full Stack)
railway_fullstack:
  shipping_speed: 9/10      # One platform
  user_experience: 8/10     # Good performance
  team_expertise: 7/10      # Less familiar
  future_flexibility: 7/10  # Platform lock-in risk
  cost_efficiency: 7/10     # Simpler billing

recommendation: "Vercel + Railway for most projects"
```

### Database Hosting
```yaml
# Default Choice: Supabase
supabase:
  shipping_speed: 10/10     # Auth + DB + APIs included
  user_experience: 9/10     # Real-time features built-in
  team_expertise: 8/10      # PostgreSQL + good docs
  future_flexibility: 8/10  # Standard PostgreSQL
  
# Alternative: Neon DB
neon_db:
  shipping_speed: 8/10      # Fast setup, branching
  user_experience: 8/10     # Good performance
  team_expertise: 9/10      # Pure PostgreSQL
  future_flexibility: 9/10  # Standard SQL

recommendation: "Supabase for apps needing auth/real-time, Neon for pure database"
```

## Decision Templates

### Technology Decision Template
```markdown
# Decision: [Technology Choice]

## Context
- **User Need**: [How this affects user experience]
- **Timeline**: [Shipping deadline/constraints]
- **Team**: [Current team expertise]
- **Scale**: [Expected user volume/growth]

## Options Evaluated

### Option 1: [Technology A]
- **Shipping Speed**: X/10 - [Explanation]
- **User Experience**: X/10 - [How it affects users]
- **Team Expertise**: X/10 - [Current knowledge]
- **Future Flexibility**: X/10 - [Migration options]
- **Total Score**: X/40

### Option 2: [Technology B]
- [Same scoring format]

## Decision
**Chosen**: [Selected Technology]

**Rationale**:
- Highest overall score
- Best serves immediate user needs
- Team can ship confidently
- Can iterate/migrate later if needed

## Implementation Plan
1. [Step 1 to implement]
2. [Step 2 to implement]
3. [Success criteria]

## Review Date
Review this decision in [timeframe] or when [trigger condition]
```

### Stack Integration Decision
```markdown
# Integration Decision: [Service/Library]

## User Benefit
How does this technology improve user experience?
- [Specific user benefit 1]
- [Specific user benefit 2]

## Implementation Cost
- Development time: [hours/days]
- Learning curve: [complexity level]
- Maintenance overhead: [ongoing cost]
- Vendor lock-in risk: [level]

## Alternatives Considered
1. **Build Custom**: [Pros/cons vs buying]
2. **Alternative Service**: [Comparison]
3. **Different Approach**: [Alternative solution]

## Decision Logic
Choose [selected option] because:
- Fastest path to serving users
- Lowest risk for timeline
- Best return on implementation time
```

## Technology Anti-Patterns

### Avoid These Technology Choices
```markdown
❌ **Bleeding Edge Technology**
- Frameworks <6 months old
- Alpha/beta versions in production
- Experimental features for core functionality

❌ **Over-Engineering Technology**
- Microservices for <10k users
- Kubernetes for simple web apps
- Custom frameworks when existing ones work

❌ **Resume-Driven Development**
- Choosing tech to learn new skills
- Using complex tech for simple problems
- Following trends instead of user needs

❌ **Not Invented Here Syndrome**
- Building custom solutions for solved problems
- Reinventing authentication/payment processing
- Creating custom component libraries

✅ **Boring Technology That Works**
- Proven frameworks with large communities
- Managed services for non-core functionality
- Simple solutions that teams understand
- Technologies optimized for shipping speed
```

## Specific Technology Recommendations

### CSS & Styling
```yaml
default_choice: "Tailwind CSS + shadcn/ui"
rationale:
  shipping_speed: "Pre-built components, utility classes"
  user_experience: "Consistent design system"
  team_expertise: "Popular, well-documented"
  future_flexibility: "Easy to customize/replace"

alternatives:
  styled_components: "Good for complex theming"
  vanilla_css: "Maximum control, more development time"
  bootstrap: "Familiar but less modern"
```

### Authentication
```yaml
default_choice: "Supabase Auth or Clerk"
rationale:
  shipping_speed: "Complete auth system in hours"
  user_experience: "Proven UX patterns"
  team_expertise: "Well-documented APIs"
  future_flexibility: "Can migrate to custom later"

alternatives:
  next_auth: "Good for custom providers"
  auth0: "Enterprise features"
  custom_auth: "Maximum control, weeks of development"
```

### Payment Processing
```yaml
default_choice: "Stripe"
rationale:
  shipping_speed: "Best developer experience"
  user_experience: "Trusted by users"
  team_expertise: "Excellent documentation"
  future_flexibility: "Industry standard"

alternatives:
  paypal: "Some users prefer it"
  square: "Good for in-person"
  custom: "Never - use Stripe"
```

### Email Service
```yaml
default_choice: "Resend"
rationale:
  shipping_speed: "Simple API, great DX"
  user_experience: "Reliable delivery"
  team_expertise: "Easy to implement"
  future_flexibility: "Standard email APIs"

alternatives:
  sendgrid: "More features, more complex"
  aws_ses: "Cheap at scale"
  mailgun: "Good deliverability"
```

## Decision Shortcuts

### When to Use Defaults
- Building MVP or prototype
- Timeline is tight (<1 week)
- Feature is not core differentiator
- Team has no strong preference

### When to Evaluate Alternatives
- Core product differentiator
- Significant user impact
- Long-term strategic importance
- Team has specific expertise

### When to Build Custom
- **Very Rarely**: Only when no existing solution serves users adequately
- Must provide 10x user benefit over existing options
- Team has deep expertise in the domain
- Becomes core competitive advantage

## Migration Planning

### Technology Debt Management
```yaml
migration_strategy:
  phase_1: "Ship with good-enough technology"
  phase_2: "Measure user satisfaction and performance"
  phase_3: "Migrate only if user experience suffers"
  
migration_triggers:
  user_complaints: "Users report speed/reliability issues"
  performance_degradation: "Response times >2x slower"
  scale_limitations: "Can't handle user growth"
  maintenance_burden: "Slowing down new feature development"
  
migration_approach:
  incremental: "Migrate one component at a time"
  maintain_ux: "No user experience disruption"
  measure_improvement: "Validate migration benefits"
```

## Success Metrics

### Technology Choice Success
- **Time to Ship**: Feature delivered on schedule
- **User Satisfaction**: No technology-related user complaints
- **Team Velocity**: Technology enables faster development
- **Maintenance**: <20% time spent on technology issues

### Warning Signs
- Development frequently blocked by technology issues
- Users report poor performance or reliability
- Team spends more time configuring than building features
- Simple features take longer than expected

## Emergency Technology Decisions

### When Current Technology Fails Users
1. **Immediate**: Implement workaround to serve users
2. **Short-term**: Evaluate alternative technology
3. **Long-term**: Plan migration strategy
4. **Communication**: Keep users informed of improvements

## References
- Apply these standards to all technology choices
- When in doubt, choose what ships fastest
- Prioritize user experience over technical elegance
- Document decisions for future reference