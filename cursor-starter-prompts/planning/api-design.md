# API Design Assistant

**Use this when:** You need to design REST APIs, GraphQL APIs, or other API interfaces for your application.

**Skill Level:** Intermediate to Advanced

---

## Copy This Prompt:

```
I need help designing a comprehensive API for my application. Please help me create a well-structured, scalable API design that follows best practices.

## Project Context:
- **Application Type**: [Web app, mobile app, microservice, etc.]
- **API Type**: [REST, GraphQL, gRPC, WebSocket, etc.]
- **Primary Use Cases**: [What will the API be used for?]
- **Expected Scale**: [Number of requests, concurrent users, etc.]
- **Data Relationships**: [Brief description of your data model]

## API Requirements:
- **Core Functionality**: [What are the main operations your API needs to support?]
- **Authentication**: [Public, API keys, OAuth, JWT, etc.]
- **Data Format**: [JSON, XML, Protocol Buffers, etc.]
- **Special Requirements**: [Real-time updates, file uploads, webhooks, etc.]

## API Design Request:

Please create a comprehensive API design that includes:

### 1. API Architecture Overview
- Overall API structure and design patterns
- Recommended architectural approach (REST, GraphQL, etc.)
- Resource identification and naming conventions
- URL structure and endpoint organization

### 2. Endpoint Design
For each major resource, provide:
- **Resource endpoints** with proper HTTP methods
- **URL patterns** and path parameters
- **Query parameters** for filtering, sorting, pagination
- **Request/response schemas** with examples
- **HTTP status codes** for different scenarios

### 3. Authentication & Authorization
- Authentication strategy and implementation
- Authorization levels and permissions
- API key management (if applicable)
- Security best practices and considerations

### 4. Data Modeling
- Request and response data structures
- Validation rules and constraints
- Relationship handling (nested resources, references)
- Error response formats

### 5. API Features
- **Pagination** strategy for large datasets
- **Filtering and sorting** capabilities
- **Versioning** approach and strategy
- **Rate limiting** implementation
- **Caching** headers and strategies

### 6. Error Handling
- Standardized error response format
- Comprehensive error codes and messages
- Validation error handling
- Debug information for development

### 7. Documentation Structure
- API documentation format (OpenAPI/Swagger)
- Example requests and responses
- Authentication examples
- SDK/client library considerations

### 8. Performance Considerations
- Optimization strategies for common operations
- Database query optimization
- Caching strategies
- Bulk operations design

### 9. Testing Strategy
- API testing approach
- Test data requirements
- Automated testing recommendations
- Performance testing considerations

### 10. Future Considerations
- Scalability planning
- Backwards compatibility strategy
- Deprecation policies
- Migration strategies

## Specific API Examples:

Please provide concrete examples for:
- **CRUD operations** for main resources
- **Complex queries** with multiple parameters
- **Batch operations** for efficiency
- **File upload/download** endpoints (if needed)
- **Real-time features** (WebSocket, Server-Sent Events)

## Additional Requirements:
- Follow RESTful principles and HTTP standards
- Include proper HTTP headers and status codes
- Consider mobile and web client needs
- Optimize for developer experience
- Plan for monitoring and analytics

Please ask clarifying questions if you need more details about specific use cases or technical requirements.
```

---

## Tips for Better Results:

- **Include your data model** - relationships between entities
- **Specify client types** - web, mobile, third-party integrations
- **Mention performance requirements** - response times, throughput
- **Include security requirements** - compliance, data sensitivity
- **Be clear about complexity** - simple CRUD vs complex business logic 