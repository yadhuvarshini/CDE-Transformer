import { ProviderConfig } from '../interface/cde-provider.interface';
import { BIM360Provider } from '../providers/bim360.provider';


describe('Provider Initialization', () => {
  it('should initialize with API key', () => {
    const provider = new BIM360Provider();
    const config: ProviderConfig = {
      apiKey: 'test-api-key-123456',
      baseUrl: 'https://api.bim360.com'
    };
    
    provider.initialize(config);
    

    expect(provider).toBeDefined();
  });
});