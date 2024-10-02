import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import orderCustomerRoutes from './routes/orderCustomerRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", orderCustomerRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})