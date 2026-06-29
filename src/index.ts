import { TcpRoutes } from './routes/TcpRoutes';
import { UdpRoutes } from './routes/UdpRoutes';
import { startTcpServer } from './infra/middleware/server/TcpServer';
import { startUdpServer } from './infra/middleware/server/UdpServer';
import { CustomerWorker } from './modules/customer/service/worker/CustomerWorker';

new CustomerWorker().registerService();
const tcpRoutes = new TcpRoutes();
const udpRoutes = new UdpRoutes();

startUdpServer(udpRoutes);
startTcpServer(tcpRoutes);
