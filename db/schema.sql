
CREATE DATABASE SDC;

-- review data
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
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
  photo_id SERIAL PRIMARY KEY,
  review_id INTEGER,
  url TEXT DEFAULT NULL
);

CREATE TABLE characteristics (
  char_id SERIAL PRIMARY KEY,
  characteristic_id INTEGER,
  review_id INTEGER,
  value INTEGER
);

CREATE TABLE characterName (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name TEXT
);

-- ALTER TABLE photos ADD CONSTRAINT fk_reviews FOREIGN KEY(review_id) REFERENCES reviews(review_id) ON DELETE CASCADE;

-- ALTER TABLE characteristics ADD CONSTRAINT fk_reviews FOREIGN KEY(review_id) REFERENCES reviews(review_id) ON DELETE CASCADE;

-- ALTER TABLE characterName ADD CONSTRAINT fk_reviews FOREIGN KEY(product_id) REFERENCES reviews(product_id) ON DELETE CASCADE;


-- /COPY photos FROM '/Users/CalebIuliano/hackreactor'/reviews/db/csv/reviews_photos.csv DELIMITER ',' CSV HEADER;

-- \COPY characteristics FROM 'db/csv/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- \COPY reviews FROM /Users/CalebIuliano/hackreactor/reviews/db/csv/reviews.csv DELIMITER ',' CSV HEADER;
-- \COPY reviews FROM /Users/CalebIuliano/hackreactor/reviews/db/csv/test.csv DELIMITER ',' CSV HEADER;

-- Fix Serial Numbers
-- SELECT pg_catalog.setval(pg_get_serial_sequence('reviews', 'review_id'), MAX(review_id)) FROM reviews;

-- SELECT pg_catalog.setval(pg_get_serial_sequence('photos', 'photo_id'), MAX(photo_id)) FROM photos;

-- SELECT pg_catalog.setval(pg_get_serial_sequence('characteristics', 'char_id'), MAX(char_id)) FROM characteristics;



-- ALTER TABLE reviews ADD COLUMN time_holder TIMESTAMP without time zone NULL;

-- Copy casted value over to the temporary column
-- UPDATE reviews SET time_holder = date::TIMESTAMP;

-- Modify original column using the temporary column
-- ALTER TABLE reviews ALTER COLUMN date TYPE TIMESTAMP without time zone USING time_holder;

-- Drop the temporary column (after examining altered column values)
-- ALTER TABLE reviews DROP COLUMN time_holder;