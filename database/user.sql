CREATE TABLE users (
    id UUID PRIMARY KEY UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    hashpass VARCHAR NOT NULL,
    weight INT,
    height INT,
    preference VARCHAR[],
    refresh_token VARCHAR
);

