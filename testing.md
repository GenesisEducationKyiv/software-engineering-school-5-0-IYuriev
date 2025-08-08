# Testing Guide

This project includes three types of tests: **unit**, **integration**, and **architecture**. All tests can be run in isolated Docker containers using Docker Compose.

---

## Preparation

Before running tests, make sure your `.env.test` files are properly filled (see [README.md](README.md#🔑-how-to-fill-environment-variables)).

---

## Running Tests

### 1. Unit Tests

```sh
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit email-test notification-test subscription-test weather-test
```

### 2. Integration Tests

```sh
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit gateway-integration-test
```

### 3. Architecture Tests

```sh
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit gateway-architecture-test
```

---

## Stopping and Cleaning Up

After tests finish, stop and remove all containers and test volumes:

```sh
docker-compose -f docker-compose.test.yml down -v
```

