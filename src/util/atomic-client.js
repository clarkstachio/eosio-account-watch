import fetch from 'node-fetch';
import { ExplorerApi } from 'atomicassets';

const atomicClient = new ExplorerApi(process.env.ATOMIC_API, 'atomicassets', {
  fetch,
});

export default atomicClient;
