-- Insert into "Role"
INSERT INTO "Role" ("roleId", "roleName")
VALUES 
    (1, 'Pembeli'),
    (2, 'Pemilik Bakeri');

-- Insert into "Region"
INSERT INTO "Region" ("regionId", "regionName")
VALUES
    (1, 'Alam Sutera'),
    (2, 'Gading Serpong'),
    (3, 'BSD');

-- Insert into "Category"
INSERT INTO "Category" ("categoryId", "categoryName", "categoryImage")
VALUES
    (1, 'Roti', 'https://example.com/category1.jpg'),
    (2, 'Pasteri', 'https://example.com/category2.jpg'),
    (3, 'Kue', 'https://example.com/category3.jpg'),
    (4, 'Lainnya', 'https://example.com/category4.jpg');

-- Insert into "User"
INSERT INTO "User" ("userId", "roleId", "userName", "userImage", "userPhoneNumber", "email", "password", "regionId")
VALUES
    (1, 1, 'Alice Johnson', 'https://example.com/image1.jpg', '1234567890', 'alice@example.com', 'password123', 1),
    (2, 2, 'Bob Smith', 'https://example.com/image2.jpg', '0987654321', 'bob@example.com', 'password456', 2),
    (3, 1, 'Charlie Brown', 'https://example.com/image3.jpg', '1122334455', 'charlie@example.com', 'password789', 3),
    (4, 2, 'David Wilson', 'https://example.com/image4.jpg', '2233445566', 'david@example.com', 'password321', 1),
    (5, 1, 'Eva Green', 'https://example.com/image5.jpg', '3344556677', 'eva@example.com', 'password654', 2);

-- Insert into "Bakery"
INSERT INTO "Bakery" ("bakeryId", "userId", "bakeryName", "bakeryImage", "bakeryDescription", "bakeryPhoneNumber", "openingTime", "closingTime", "regionId")
VALUES
    (1, 1, 'Sweet Treats', 'https://example.com/bakery1.jpg', 'Delicious cakes and pastries.', '111-222-3333', '08:00', '20:00', 1),
    (2, 2, 'Bread Heaven', 'https://example.com/bakery2.jpg', 'Freshly baked bread daily.', '444-555-6666', '06:00', '18:00', 2),
    (3, 3, 'Cookie Corner', 'https://example.com/bakery3.jpg', 'The best cookies in town.', '777-888-9999', '09:00', '22:00', 3);

-- Insert Products for Two Bakeries
INSERT INTO "Product" ("bakeryId", "categoryId", "productName", "productPrice", "productImage", "productDescription", "productExpirationDate", "productStock")
VALUES
    (1, 1, 'Vanilla Cupcake', 8000, 'https://example.com/product4.jpg', 'Delicious vanilla cupcake with sprinkles.', '2024-12-31', 5),
    (1, 2, 'Rye Bread', 18000, 'https://example.com/product5.jpg', 'Fresh rye bread with a hearty flavor.', '2024-11-30', 3),
    (2, 1, 'Banana Bread', 12000, 'https://example.com/product6.jpg', 'Moist banana bread with walnuts.', '2024-10-20', 4),
    (2, 3, 'Apple Pie', 25000, 'https://example.com/product7.jpg', 'Classic apple pie with a flaky crust.', '2024-11-05', 2),
    (2, 3, 'Cheese Croissant', 15000, 'https://example.com/product8.jpg', 'Buttery croissant filled with cheese.', '2024-11-12', 6);

-- Insert Discounts for New Products
INSERT INTO "ListDiscount" ("productId", "discountDate", "discountAmount")
VALUES
    (1, '2024-10-01', 1000),
    (2, '2024-10-01', 2000),
    (3, '2024-10-01', 1500),
    (4, '2024-10-01', 3000),
    (5, '2024-10-01', 2500);

-- Insert Ratings for Different Users and Bakeries
INSERT INTO "Rating" ("userId", "bakeryId", "rating", "createdDate")
VALUES
    (1, 1, 5, '2024-10-01'),
    (1, 2, 4, '2024-10-02'),
    (2, 1, 3, '2024-10-03'),
    (2, 2, 5, '2024-10-04');

-- Insert Orders for Testing
INSERT INTO "Order" ("userId", "bakeryId", "orderDate", "orderStatus")
VALUES
    (2, 1, '2024-10-05', 1),
    (2, 2, '2024-10-06', 2);

-- Insert Order Details for Various Products
INSERT INTO "OrderDetail" ("orderId", "productId", "productQuantity")
VALUES
    (1, 1, 2),  -- User 2, Bakery 1, Vanilla Cupcake
    (1, 2, 1),  -- User 2, Bakery 1, Rye Bread
    (2, 3, 3),  -- User 2, Bakery 2, Banana Bread
    (2, 4, 1);  -- User 2, Bakery 2, Apple Pie

-- Insert Favorites for Users and Bakeries
INSERT INTO "Favorite" ("userId", "bakeryId")
VALUES
    (2, 1),
    (2, 2);

-- Insert into "RefreshToken"
INSERT INTO "RefreshToken" ("jti", "hashedToken", "userId")
VALUES
    ('token1', 'hashed_token_1', 1),
    ('token2', 'hashed_token_2', 2),
    ('token3', 'hashed_token_3', 3);
