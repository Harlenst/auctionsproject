import express, { Application} from 'express';
import userRouter from './routes/users';
import auctionRouter from './routes/auctions';

const PORT:number=5000;
const app:Application=express();
app.use(express.json());

app.use('/api/v1', userRouter);
app.use('/api/v1', auctionRouter);

app.listen(PORT,()=>{
    console.log(`Server running at  ${PORT}`);
});