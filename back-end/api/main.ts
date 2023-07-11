import express from 'express';
import cors from 'cors';
import networkRoutes from './routes/network.route';
import channelRoutes from './routes/channel.route';
import chaincodeRoutes from './routes/chaincode.route';

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.use(networkRoutes);
app.use(channelRoutes);
app.use(chaincodeRoutes);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
