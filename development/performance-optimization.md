# Performance Optimization Assistant

**Use this when:** You need to systematically improve the performance of your application, API, or specific code components.

**Skill Level:** Intermediate to Advanced

---

## Copy This Prompt:

```
I need help optimizing the performance of my application. Please help me systematically identify bottlenecks and implement performance improvements.

## Application Context:
- **Application Type**: [Web app, API, mobile app, desktop app, etc.]
- **Technology Stack**: [Languages, frameworks, databases, etc.]
- **Current Performance Issues**: [Slow loading, high response times, memory usage, etc.]
- **Performance Goals**: [Target response times, throughput, resource usage]
- **User Scale**: [Current and expected user load]

## Performance Areas to Analyze:
[Describe specific areas where you're experiencing performance issues]

## Current Performance Metrics:
[Include any existing performance data - response times, memory usage, CPU usage, etc.]

## Performance Optimization Strategy:

Please provide a comprehensive performance optimization plan that covers:

### 1. Performance Analysis
- **Current State Assessment**: Analyze existing performance metrics
- **Bottleneck Identification**: Identify primary performance bottlenecks
- **Profiling Strategy**: Recommend profiling tools and techniques
- **Measurement Baseline**: Establish performance baselines
- **Monitoring Setup**: Ongoing performance monitoring

### 2. Frontend Performance (if applicable)
- **Bundle Optimization**: Code splitting, tree shaking, minification
- **Asset Optimization**: Image compression, lazy loading, CDN usage
- **Rendering Performance**: Virtual DOM optimization, re-render reduction
- **Network Optimization**: HTTP/2, resource hints, caching strategies
- **JavaScript Performance**: Async operations, memory management

### 3. Backend Performance
- **API Optimization**: Response time reduction, payload optimization
- **Database Performance**: Query optimization, indexing strategies
- **Caching Implementation**: Redis, in-memory caching, CDN caching
- **Connection Management**: Connection pooling, keep-alive settings
- **Async Processing**: Background jobs, message queues

### 4. Database Optimization
- **Query Performance**: Slow query identification and optimization
- **Index Strategy**: Optimal indexing for common queries
- **Schema Optimization**: Database design improvements
- **Connection Pooling**: Database connection management
- **Caching Layer**: Query result caching, ORM optimization

### 5. Memory Optimization
- **Memory Usage Analysis**: Memory leak detection and prevention
- **Garbage Collection**: GC optimization and tuning
- **Object Pooling**: Reusable object management
- **Memory Profiling**: Tools and techniques for memory analysis
- **Resource Cleanup**: Proper resource disposal

### 6. CPU Optimization
- **Algorithm Optimization**: More efficient algorithms and data structures
- **Computational Complexity**: Big O analysis and improvements
- **Parallel Processing**: Multi-threading, async operations
- **CPU Profiling**: Identifying CPU-intensive operations
- **Optimization Patterns**: Caching, memoization, lazy evaluation

### 7. Network Performance
- **API Response Optimization**: Payload size reduction, compression
- **HTTP Optimization**: Keep-alive, connection reuse, HTTP/2
- **CDN Implementation**: Content delivery network setup
- **Bandwidth Optimization**: Image optimization, asset compression
- **Request Reduction**: Batching, combining requests

### 8. Caching Strategies
- **Multi-Level Caching**: Browser, CDN, application, database caching
- **Cache Invalidation**: Smart cache invalidation strategies
- **Cache Warming**: Preloading frequently accessed data
- **Cache Sizing**: Optimal cache size configuration
- **Cache Monitoring**: Cache hit rates and performance metrics

### 9. Scalability Improvements
- **Horizontal Scaling**: Load balancing, auto-scaling setup
- **Vertical Scaling**: Resource optimization for single instances
- **Database Scaling**: Read replicas, sharding strategies
- **Microservices**: Service decomposition for scalability
- **Load Testing**: Capacity planning and stress testing

### 10. Monitoring and Alerting
- **Performance Metrics**: Key performance indicators (KPIs)
- **Real-time Monitoring**: Application performance monitoring (APM)
- **Alert Configuration**: Performance degradation alerts
- **Performance Dashboards**: Visualization and reporting
- **Continuous Monitoring**: Ongoing performance tracking

## Code-Level Optimizations:

For the code I provide, please analyze and optimize:
- **Algorithm Efficiency**: More efficient algorithms
- **Data Structure Selection**: Optimal data structures
- **Loop Optimization**: Efficient iteration patterns
- **Function Optimization**: Pure functions, memoization
- **Resource Management**: Memory and connection cleanup

## Implementation Plan:

Please provide:
- **Prioritized Optimization List**: High-impact, low-effort improvements first
- **Before/After Comparisons**: Show performance improvements
- **Specific Code Examples**: Optimized code implementations
- **Measurement Strategies**: How to measure improvement success
- **Implementation Timeline**: Suggested order of implementation

## Performance Testing:
- **Load Testing**: Stress testing under realistic conditions
- **Benchmark Creation**: Performance benchmark suite
- **Regression Testing**: Preventing performance regressions
- **A/B Testing**: Comparing optimization effectiveness
- **Continuous Performance Testing**: Automated performance validation

## Tools and Techniques:
- Recommend performance profiling tools
- Suggest monitoring and alerting solutions
- Provide benchmarking and load testing tools
- Recommend optimization libraries and frameworks

[PASTE YOUR CODE OR DESCRIBE SPECIFIC PERFORMANCE ISSUES HERE]

Please focus on practical, measurable improvements that provide significant performance gains.
```

---

## Tips for Better Results:

- **Include specific performance metrics** - current response times, memory usage
- **Mention your performance goals** - target improvements, SLA requirements
- **Provide code samples** - specific functions or components with performance issues
- **Include your monitoring setup** - what tools you currently use
- **Specify constraints** - budget, time, backwards compatibility requirements 