import { promises } from 'node:fs';

export const deleteFile = async (fileName: string) => {
  try {
    await promises.stat(fileName);
  } catch (error) {
    return;
  }
  await promises.unlink(fileName);
};
