import { container } from 'tsyringe';

import { IHashProvider } from './IHashProvider';
import { BcryptHashProvider } from './implementations/BcryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
