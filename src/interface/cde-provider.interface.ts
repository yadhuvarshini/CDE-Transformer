export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
}


export interface ICDEProvider {
    initialize(config: ProviderConfig): void;
    fetchFiles(projectId?: string): Promise<CommonFile[]>;
}

export interface CommonFile {
  source: 'bim360' | 'procore' | 'viewpoint' | 'trimble' | 'accnoex';
  projectId: string;
  fileId: string;
  name: string;
  version: string;
  size: number;
  downloadUrl: string;
  updatedAt: string; 
}