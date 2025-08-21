import { ICDEProvider, CommonFile, ProviderConfig } from './../interface/cde-provider.interface';

export class ViewpointProvider implements ICDEProvider {
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
  console.log(`Fetching Viewpoint files for project: ${projectId || 'all projects'}`);
  
  await new Promise(resolve => setTimeout(resolve, 60));
  
  
  return [
    {
      source: 'viewpoint',
      projectId: 'proj_1',
      fileId: 'viewpoint_file_001',
      name: 'architectural-plan.pdf', 
      version: '3', 
      size: 2400000,
      downloadUrl: 'https://viewpoint.com/download/file_001',
      updatedAt: '2025-07-05T11:15:00Z' 
    },
    {
      source: 'viewpoint',
      projectId: 'proj_1',
      fileId: 'viewpoint_file_002',
      name: 'mechanical-specs.pdf',
      version: '1',
      size: 3200000,
      downloadUrl: 'https://viewpoint.com/download/file_002',
      updatedAt: '2025-07-12T08:45:00Z'
    },
    {
      source: 'viewpoint', 
      projectId: 'proj_3',
      fileId: 'viewpoint_file_003',
      name: 'site-plan.pdf',
      version: '2',
      size: 1500000,
      downloadUrl: 'https://viewpoint.com/download/file_003',
      updatedAt: '2025-07-09T10:30:00Z'
    }

  ];
 }
}

export class TrimbleProvider implements ICDEProvider {
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
    console.log(`Fetching Trimble files for project: ${projectId || 'all projects'}`);
    
    await new Promise(resolve => setTimeout(resolve, 55));
    
    return [
        {
      source: 'trimble',
      projectId: 'proj_2',
      fileId: 'trimble_file_001',
      name: 'survey-data.pdf',
      version: '1',
      size: 1800000,
      downloadUrl: 'https://trimble.com/download/file_001',
      updatedAt: '2025-07-11T13:20:00Z'
     }
    ];
  }
}

export class AccnoexProvider implements ICDEProvider {

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
    console.log(`Fetching Accnoex files for project: ${projectId || 'all projects'}`);
    
    await new Promise(resolve => setTimeout(resolve, 65));
    
    return [
        {
        source: 'accnoex',
        projectId: 'proj_3',
        fileId: 'accnoex_file_001',
        name: 'cost-estimate.xlsx',
        version: '2',
        size: 1200000,
        downloadUrl: 'https://accnoex.com/download/file_001',
        updatedAt: '2025-07-10T15:00:00Z'
        }
    ];
  }
}