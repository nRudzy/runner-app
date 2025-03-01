import { ApiRepository } from '../../domain/repositories/ApiRepository';
import { ApiRepositoryImpl } from '../../data/repositories/ApiRepositoryImpl';

class ServiceLocator {
  private static instance: ServiceLocator;
  private repositories: Map<string, any> = new Map();

  private constructor() {
    // Initialiser les repositories
    this.repositories.set('apiRepository', new ApiRepositoryImpl());
  }

  public static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  public getApiRepository(): ApiRepository {
    return this.repositories.get('apiRepository');
  }
}

export default ServiceLocator; 