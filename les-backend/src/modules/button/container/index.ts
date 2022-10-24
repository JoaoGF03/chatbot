import { container } from 'tsyringe';

import { IButtonsRepository } from '../repositories/IButtonsRepository';
import { ButtonsRepository } from '../repositories/implementations/ButtonsRepository';

container.registerSingleton<IButtonsRepository>(
  'ButtonsRepository',
  ButtonsRepository,
);
