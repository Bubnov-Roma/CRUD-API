import cluster from 'cluster';
import os from 'os';
import { app } from './app';

const numCPUs = os.cpus().length;
const PORT = parseInt(process.env.PORT || '4000');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Starting ${numCPUs - 1} workers...`);

  for (let i = 1; i < numCPUs; i +=1) {
    const workerPort = PORT + i;
    cluster.fork({WORKER_PORT: workerPort});
  }
  const balancer = app;
  balancer.listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
    console.log(`Workers running on ports ${PORT + 1} to ${PORT + numCPUs - 1}`);
  });
  cluster.on('exit', (worker, _code, _signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const workerPort = parseInt(process.env.WORKER_PORT || '4001');
  app.listen(workerPort, () => {
    console.log(`Worker ${process.pid} listening on port ${workerPort}`);
  })
}