
CREATE DATABASE SDC;

-- review data
CREATE TABLE reviews (
  id SERIAL NOT NULL,
  product_id INTEGER,
  rating INTEGER DEFAULT NULL,
  date VARCHAR(500),
  summary VARCHAR(250),
  body VARCHAR(1000),
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(50),
  reviewer_email VARCHAR(50),
  response VARCHAR(300),
  helpfulness INTEGER,
  PRIMARY KEY (id)
);

-- each photo connects to a single product id
CREATE TABLE photos (
  id SERIAL NOT NULL,
  review_id INTEGER DEFAULT NULL,
  url TEXT DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_reviews
    FOREIGN KEY(review_id)
      REFERENCES reviews(id)
      ON DELETE CASCADE
);

CREATE TABLE characteristics (
  id SERIAL NOT NULL,
  characteristic_id INTEGER,
  review_id INTEGER,
  value INTEGER,
  PRIMARY KEY (id),
  CONSTRAINT fk_reviews
    FOREIGN KEY(review_id)
      REFERENCES reviews(id)
      ON DELETE CASCADE
);

-- ALTER TABLE photos ADD CONSTRAINT fk_reviews FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE;

-- ALTER TABLE characteristics ADD CONSTRAINT fk_reviews FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE;


COPY photos FROM /Users/CalebIuliano/hackreactor/reviews/db/csv/reviews_photos.csv DELIMITER ',' CSV HEADER;

-- \COPY characteristics FROM 'db/csv/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- \COPY reviews FROM /Users/CalebIuliano/hackreactor/reviews/db/csv/reviews.csv DELIMITER ',' CSV HEADER;





-- // mysql -u root < server/schema.sql