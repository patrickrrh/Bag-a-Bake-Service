-- Insert into "Role"
INSERT INTO "Role" ("roleId", "roleName")
VALUES 
    (1, 'Pembeli'),
    (2, 'Penjual');

-- Insert into "Region"
INSERT INTO "Region" ("regionId", "regionName")
VALUES
    (1, 'BSD'),
    (2, 'GS'),
    (3, 'ALS');

-- Insert into "Category"
INSERT INTO "Category" ("categoryId", "categoryName", "categoryImage")
VALUES
    (1, 'Cakes', 'https://example.com/category1.jpg'),
    (2, 'Bread', 'https://example.com/category2.jpg'),
    (3, 'Pastries', 'https://example.com/category3.jpg');

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

-- Insert into "Product"
INSERT INTO "Product" ("productId", "bakeryId", "categoryId", "productName", "productPrice", "productImage", "productDescription", "productExpirationDate", "productStock")
VALUES
    (1, 1, 1, 'Chocolate Cake', 15.99, 'https://example.com/product1.jpg', 'Rich chocolate cake with creamy frosting.', '2024-12-31', 50),
    (2, 2, 2, 'Sourdough Bread', 5.49, 'https://example.com/product2.jpg', 'Artisan sourdough bread made daily.', '2024-10-31', 100),
    (3, 3, 3, 'Blueberry Muffin', 3.99, 'https://example.com/product3.jpg', 'Moist blueberry muffin with a crumbly top.', '2024-11-15', 200);

-- Insert into "ListDiscount"
INSERT INTO "ListDiscount" ("discountId", "productId", "discountAmount")
VALUES
    (1, 1, 2.00),
    (2, 2, 1.50),
    (3, 3, 0.50);

-- Updated Order Inserts
INSERT INTO "Order" ("orderId", "userId", "bakeryId", "orderDate", "orderStatus", "orderTotalPrice")
VALUES
    (1, 1, 1, '2024-10-01', 0, 20),
    (2, 2, 2, '2024-10-02', 1, 15),
    (3, 3, 3, '2024-10-03', 2, 30);

-- OrderDetail Inserts
INSERT INTO "OrderDetail" ("orderDetailId", "orderId", "productId", "productQuantity", "productTotalPrice")
VALUES
    (1, 1, 1, 1, 15.99),
    (2, 1, 2, 1, 5.49),
    (3, 2, 2, 2, 10.98),
    (4, 3, 3, 5, 19.95);

-- Insert into "Favorite"
INSERT INTO "Favorite" ("favoriteId", "userId", "bakeryId")
VALUES
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 3),
    (4, 1, 2);

-- Insert into "RefreshToken"
INSERT INTO "RefreshToken" ("jti", "hashedToken", "userId")
VALUES
    ('token1', 'hashed_token_1', 1),
    ('token2', 'hashed_token_2', 2),
    ('token3', 'hashed_token_3', 3);
