"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const bakeryRoutes_1 = __importDefault(require("./routes/bakeryRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const orderCustomerRoutes_1 = __importDefault(require("./routes/orderCustomerRoutes"));
const orderSellerRoutes_1 = __importDefault(require("./routes/orderSellerRoutes"));
const ratingRoutes_1 = __importDefault(require("./routes/ratingRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'X-Auth-Token'],
}));
app.use(express_1.default.json());
const apiRouter = express_1.default.Router();
apiRouter.use(authRoutes_1.default);
apiRouter.use(productRoutes_1.default);
apiRouter.use(categoryRoutes_1.default);
apiRouter.use(bakeryRoutes_1.default);
apiRouter.use(favoriteRoutes_1.default);
apiRouter.use(orderCustomerRoutes_1.default);
apiRouter.use(orderSellerRoutes_1.default);
apiRouter.use(ratingRoutes_1.default);
apiRouter.use(paymentRoutes_1.default);
app.use('/api', apiRouter);
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
