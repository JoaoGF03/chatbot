import { app } from './app';

app.listen(process.env.PORT || 3333, () => {
  console.log(
    `🚀 ~ file: server.ts ~ port ${process.env.PORT ? process.env.PORT : 3333}`,
  );
});
