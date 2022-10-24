import { httpServer } from './app';
import './websocket';

httpServer.listen(3333, () => {
  // eslint-disable-next-line
  console.log('server is running on port 3333 🎉');
});
