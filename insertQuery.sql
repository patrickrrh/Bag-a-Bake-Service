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
    (1, 1, 'Sweet Treats', 'https://example.com/bakery1.jpg', 'Delicious cakes and pastries.', '111-222-3333', '08:00', '20:00', 1);

-- Insert into "Product" with bakeryId set to 1 for all products
INSERT INTO "Product" ("productId", "bakeryId", "categoryId", "productName", "productPrice", "productImage", "productDescription", "productExpirationDate", "productStock")
VALUES
    (1, 1, 1, 'Chocolate Cake', 15.99, 'https://example.com/product1.jpg', 'Rich chocolate cake with creamy frosting.', '2024-12-31', 50),
    (2, 1, 2, 'Sourdough Bread', 5.49, 'https://example.com/product2.jpg', 'Artisan sourdough bread made daily.', '2024-10-31', 100),
    (3, 1, 3, 'Blueberry Muffin', 3.99, 'https://example.com/product3.jpg', 'Moist blueberry muffin with a crumbly top.', '2024-11-15', 200);

-- Insert into "ListDiscount"
INSERT INTO "ListDiscount" ("discountId", "productId", "discountAmount")
VALUES
    (1, 1, 2.00),
    (2, 2, 1.50),
    (3, 3, 0.50);

-- Updated Order Inserts with bakeryId set to 1
INSERT INTO "Order" ("orderId", "userId", "bakeryId", "orderDate", "orderStatus")
VALUES
    (1, 1, 1, '2024-10-01', 1),
    (2, 2, 1, '2024-10-02', 2),
    (3, 3, 1, '2024-10-03', 3);

-- OrderDetail Inserts (these remain the same, since they reference products not bakeries directly)
INSERT INTO "OrderDetail" ("orderDetailId", "orderId", "productId", "productQuantity")
VALUES
    (1, 1, 1, 1),
    (2, 1, 2, 1),
    (3, 2, 2, 2),
    (4, 3, 3, 5);

-- Insert into "Favorite" with bakeryId set to 1 for all entries
INSERT INTO "Favorite" ("favoriteId", "userId", "bakeryId")
VALUES
    (1, 1, 1),
    (2, 2, 1),
    (3, 3, 1),
    (4, 1, 1);

-- Insert into "RefreshToken"
INSERT INTO "RefreshToken" ("jti", "hashedToken", "userId")
VALUES
    ('token1', 'hashed_token_1', 1),
    ('token2', 'hashed_token_2', 2),
    ('token3', 'hashed_token_3', 3);
