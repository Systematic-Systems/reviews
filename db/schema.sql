
CREATE DATABASE SDC;

-- review data
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  rating INTEGER,
  date VARCHAR(500),
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



-- ALTER TABLE reviews ADD COLUMN time_holder TIMESTAMP without time zone NULL;

-- Copy casted value over to the temporary column
-- UPDATE reviews SET time_holder = date::TIMESTAMP;

-- Modify original column using the temporary column
-- ALTER TABLE reviews ALTER COLUMN date TYPE TIMESTAMP without time zone USING time_holder;

-- Drop the temporary column (after examining altered column values)
-- ALTER TABLE reviews DROP COLUMN time_holder;