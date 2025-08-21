import { BIM360Provider } from '../providers/bim360.provider';
import { ProcoreProvider } from '../providers/procore.provider';
import { ProviderConfig } from './../interface/cde-provider.interface';

describe('Provider Configuration', () => {
  it('should accept different base URLs for different providers', () => {
    const bim360Config: ProviderConfig = {
      apiKey: 'bim360-key-123',
      baseUrl: 'https://developer.api.autodesk.com/bim360/docs/v1'
    };

    const procoreConfig: ProviderConfig = {
      apiKey: 'procore-key-456', 
      baseUrl: 'https://api.procore.com/v1'
    };

    const bim360Provider = new BIM360Provider();
    const procoreProvider = new ProcoreProvider();

    bim360Provider.initialize(bim360Config);
    procoreProvider.initialize(procoreConfig);

    expect(bim360Provider).toBeDefined();
    expect(procoreProvider).toBeDefined();
  });

  it('should work without baseUrl (optional)', () => {
    const config: ProviderConfig = {
      apiKey: 'test-key-789'
    };

    const provider = new BIM360Provider();
    provider.initialize(config);

    expect(provider).toBeDefined();
  });
});