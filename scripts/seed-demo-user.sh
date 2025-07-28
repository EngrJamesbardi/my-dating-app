#!/bin/bash
# Seed initial interests and preferences data
psql "$POSTGRES_URI" <<EOF
INSERT INTO users (email, name, interests, preferences) VALUES ('demo@datingapp.com', 'Demo User', ARRAY['music','sports','travel'], '{"minAge":18,"maxAge":35,"gender":["female"],"distance":50,"interests":["music","sports"]}');
EOF
