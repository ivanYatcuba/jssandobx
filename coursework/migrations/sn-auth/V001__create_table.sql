CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tokens (
    userId UUID NOT NULL,
    clientId VARCHAR(255) NOT NULL,
    accessToken TEXT NOT NULL,
    refreshToken TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT now(),
    updatedAt TIMESTAMP,
    PRIMARY KEY(userId, clientId)
)
