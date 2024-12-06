-- CreateTable
CREATE TABLE "Role" (
    "roleId" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "userImage" TEXT,
    "userPhoneNumber" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "pushToken" TEXT,
    "signUpDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCancelled" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Bakery" (
    "bakeryId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bakeryName" TEXT NOT NULL,
    "bakeryImage" TEXT NOT NULL,
    "bakeryDescription" TEXT NOT NULL,
    "bakeryPhoneNumber" TEXT NOT NULL,
    "openingTime" TEXT NOT NULL,
    "closingTime" TEXT NOT NULL,
    "bakeryAddress" TEXT NOT NULL,
    "bakeryLatitude" DOUBLE PRECISION NOT NULL,
    "bakeryLongitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Bakery_pkey" PRIMARY KEY ("bakeryId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "paymentId" SERIAL NOT NULL,
    "bakeryId" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentService" TEXT NOT NULL,
    "paymentDetail" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryImage" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" SERIAL NOT NULL,
    "bakeryId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productPrice" DECIMAL(10,2) NOT NULL,
    "productImage" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "productCreatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productExpirationDate" TIMESTAMP(3) NOT NULL,
    "productStock" INTEGER NOT NULL,
    "isActive" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "ListDiscount" (
    "discountId" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "discountDate" TIMESTAMP(3) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ListDiscount_pkey" PRIMARY KEY ("discountId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bakeryId" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderStatus" INTEGER NOT NULL DEFAULT 0,
    "proofOfPayment" TEXT,
    "paymentStartedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "orderDetailId" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productQuantity" INTEGER NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("orderDetailId")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "favoriteId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bakeryId" INTEGER NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("favoriteId")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "jti" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("jti")
);

-- CreateTable
CREATE TABLE "Rating" (
    "ratingId" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("ratingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bakery_userId_key" ON "Bakery"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_bakeryId_key" ON "Favorite"("userId", "bakeryId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_orderId_key" ON "Rating"("orderId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bakery" ADD CONSTRAINT "Bakery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("bakeryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("bakeryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListDiscount" ADD CONSTRAINT "ListDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("bakeryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("bakeryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;
