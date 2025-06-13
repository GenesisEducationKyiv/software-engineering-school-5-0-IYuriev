# ADR-001: Choosing a Framework for Backend API Development

**Status:** Accepted  
**Date:** 2025-06-08  
**Author:** Illia Yuriev

## Context

It is necessary to choose a backend framework for implementing:
- REST API for weather data and subscriptions
- User subscription management (creation, confirmation, unsubscription)
- Integration with external APIs (WeatherAPI, SMTP)
- Scheduling and sending notifications
- Data validation, logging, and error handling

## Considered Options

### 1. NestJS (Node.js)
**Pros:**
- Modular architecture, built-in support for REST, GraphQL, and WebSockets
- TypeScript support out of the box
- Powerful dependency injection and testing tools
- Large ecosystem and active community
- Easy integration with popular ORMs (Prisma, TypeORM)
- Built-in support for validation, scheduling, and configuration

**Cons:**
- Slightly higher learning curve compared to Express
- More boilerplate code for simple projects

### 2. Express (Node.js)
**Pros:**
- Minimalistic and flexible
- Large ecosystem and community
- Quick to start for small APIs

**Cons:**
- Lacks structure for large-scale applications
- Manual setup required for validation, DI, and testing
- No built-in support for advanced features (scheduling, modules)

### 3. Fastify (Node.js)
**Pros:**
- High performance
- Schema-based validation
- Modern plugin system

**Cons:**
- Smaller ecosystem compared to Express/NestJS
- Less documentation and community support

### 4. AdonisJS (Node.js)
**Pros:**
- Full-featured framework with built-in ORM, authentication, CLI, and migrations
- Clear project structure
- TypeScript support

**Cons:**
- Smaller ecosystem and community compared to NestJS
- Fewer learning resources

### 5. Next.js (Node.js)
**Pros:**
- SSR/SSG for frontend
- API routes for backend
- Fast start for full-stack projects

**Cons:**
- Not specialized for complex backend APIs
- Fewer backend-specific features (DI, modularity, advanced testing)

## Decision

**NestJS** was chosen as the main backend framework.

## Consequences

**Positive:**
- Scalability and modular architecture
- TypeScript support and strong typing
- Built-in dependency injection and testing tools
- Ready for production workloads
- Easy integration with validation, scheduling, and configuration

**Negative:**
- More complex initial setup compared to minimal frameworks
- Slightly higher learning curve for new developers
