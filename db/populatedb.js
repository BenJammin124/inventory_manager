require("dotenv").config();

const { Client } = require("pg");

const ROLE_NAME = process.env.ROLE_NAME;
const HOST = process.env.HOST;
const DB = process.env.DB;
const ROLE_PASSWORD = process.env.ROLE_PASSWORD;
const PORT = process.env.PORT;

const SQL = `
CREATE TABLE category (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR(255) NOT NULL UNIQUE,
    image_url VARCHAR(420)
);

CREATE TABLE supplier (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  supplier_name VARCHAR(50) NOT NULL,
  email VARCHAR(60),
  phone VARCHAR(20),
  image_url VARCHAR(420)
);

CREATE TABLE IF NOT EXISTS product (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_name VARCHAR ( 255 ),
  quantity INT,
  price DECIMAL(10,2),
  unit VARCHAR(50),
  category_id INT,
  supplier_id INT,
  image_url VARCHAR(420) DEFAULT 'https://placehold.co/150x150?text=Default+Pic',
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT
);

INSERT INTO category (category_name, image_url)
VALUES 
('Dairy', 'https://img.icons8.com/?size=100&id=118749&format=png&color=000000'),
('Seafood', 'https://img.icons8.com/?size=100&id=65468&format=png&color=000000'),
('Produce', 'https://img.icons8.com/?size=100&id=87175&format=png&color=000000'),
('Meat', 'https://img.icons8.com/?size=100&id=70439&format=png&color=000000'),
('Condiments', 'https://img.icons8.com/?size=100&id=65027&format=png&color=000000');

INSERT INTO supplier (supplier_name, email, phone, image_url)
VALUES 
  ('Sysco', 'help@sysco.com', '523-999-1094', 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Sysco-Logo.svg'),
  ('US. Foods', 'usfoods@hotmail.com', '193-123-1241', 'https://upload.wikimedia.org/wikipedia/commons/d/d1/US_Foods_logo.svg');

INSERT INTO product (product_name, quantity, price, unit, category_id, supplier_id, image_url) 
VALUES
  ('Ribeye', 20, 9.99, 'lb', 4, 1, 'https://img.icons8.com/?size=100&id=70439&format=png&color=000000'),
  ('Butter', 10, 1.99, 'lb', 1, 1, 'https://img.icons8.com/?size=100&id=EyP0FAk4p9VU&format=png&color=000000'),
  ('Carrots', 12, 0.99, 'lb', 3, 1, 'https://img.icons8.com/?size=100&id=6f2WYNoYqbXP&format=png&color=000000'),
  ('Mayonnaise', 2, 1.50, '12oz', 5, 2, 'https://img.icons8.com/?size=100&id=AmH0IoKVa1yQ&format=png&color=000000'),
  ('Ketchup', 7, 0.99, '12oz', 5, 2, 'https://img.icons8.com/?size=100&id=AFGzfnFu6tI9&format=png&color=000000'),
  ('Shrimp', 2, 8.99, 'lb', 2, 1, 'https://img.icons8.com/?size=100&id=101722&format=png&color=000000'),
  ('Baby bella', 2.99, '8oz' 3, 1, 'https://img.icons8.com/?size=100&id=70489&format=png&color=000000'),
  ('Bacon', 99, 9.99, 'lb', 4, 2, 'https://img.icons8.com/?size=100&id=Vy01CRLnfhpQ&format=png&color=000000')
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${ROLE_NAME}:${ROLE_PASSWORD}@${HOST}:${PORT}/${DB}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
