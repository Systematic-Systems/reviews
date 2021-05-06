
CREATE DATABASE SDC;

-- review data
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  rating INTEGER,
  date VARCHAR(250),
  summary VARCHAR(250),
  body VARCHAR(1000),
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(50),
  reviewer_email VARCHAR(50),
  response VARCHAR(300),
  helpfulness INTEGER
);

-- each photo connects to a single product id
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER,
  url TEXT DEFAULT NULL
);

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER,
  review_id INTEGER,
  value INTEGER
);

-- ALTER TABLE photos ADD CONSTRAINT fk_reviews FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE;

-- ALTER TABLE characteristics ADD CONSTRAINT fk_reviews FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE;


-- /COPY photos FROM '/Users/CalebIuliano/hackreactor'/reviews/db/csv/reviews_photos.csv DELIMITER ',' CSV HEADER;

-- \COPY characteristics FROM 'db/csv/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- \COPY reviews FROM /Users/CalebIuliano/hackreactor/reviews/db/csv/reviews.csv DELIMITER ',' CSV HEADER;
-- \COPY reviews FROM /Users/CalebIuliano/hackreactor/reviews/db/csv/test.csv DELIMITER ',' CSV HEADER;

-- Fix Serial Numbers
-- SELECT pg_catalog.setval(pg_get_serial_sequence('reviews', 'id'), MAX(id)) FROM reviews;



-- // mysql -u root < server/schema.sql