import aiModels from './aiModels.json';

export const aiConfig = {
  activeModel: aiModels.activeModel as keyof typeof aiModels.models,
  models: aiModels.models,
};
