import { ICDEProvider, CommonFile,ProviderConfig } from './../interface/cde-provider.interface';

export class ProcoreProvider implements ICDEProvider {
  
  private config: ProviderConfig;

    constructor() {
        this.config = {
        apiKey: '', 
        baseUrl: ''
        };
    }

    initialize(config: ProviderConfig): void {
        this.config = config;
        this.setupApiClient();
    }

    private setupApiClient(): void {
    console.log(`Initialized with API key: ${this.config.apiKey.slice(0, 8)}...`);
    }


  async fetchFiles(projectId?: string): Promise<CommonFile[]> {
    console.log(`Fetching Procore files for project: ${projectId || 'all projects'}`);
    
    await new Promise(resolve => setTimeout(resolve, 70));
    
    const mockProcoreResponse = [
      {
        id: 'procore_file_001',
        project_id: 'proj_2',
        name: 'electrical-layout.pdf',
        version: {
          version_number: '1'
        },
        size: 3500000, // bytes
        download_url: 'https://procore.com/download/file_001',
        updated_at: '2025-07-01T09:30:00Z',
        created_at: '2025-06-28T14:20:00Z'
      },
      {
        id: 'procore_file_002',
        project_id: 'proj_2', 
        name: 'mechanical-specs.pdf',
        version: {
          version_number: '3'
        },
        size: 4200000,
        download_url: 'https://procore.com/download/file_002',
        updated_at: '2025-07-05T16:45:00Z',
        created_at: '2025-06-30T10:15:00Z'
      }
    ];

    const commonFiles: CommonFile[] = mockProcoreResponse.map(item => ({
      source: 'procore',
      projectId: item.project_id,
      fileId: item.id,
      name: item.name,
      version: item.version.version_number,
      size: item.size,
      downloadUrl: item.download_url,
      updatedAt: item.updated_at
    }));

    return commonFiles;
  }
}