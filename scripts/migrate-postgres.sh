#!/bin/bash
# Run PostgreSQL migrations
psql "$POSTGRES_URI" -f infrastructure/postgres-init.sql
