import { ICDEProvider, CommonFile, ProviderConfig } from './../interface/cde-provider.interface';
import { retryWithBackoff} from './../utils/retry.util';

export class BIM360Provider implements ICDEProvider {

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
        console.log(`Fetching files for project: ${projectId || 'all projects'}`);
        await new Promise(resolve => setTimeout(resolve, 60)); 

        const mockBIM360Response = {
            data: [ 
                {
                    id: 'bim360-file-1',
                    attributes: {
                        name: 'architectural-plan.pdf',
                        version_number: '1.0',
                        length: 2048000,
                        download: {
                            href: 'https://autodesk.com/bim360/id=bim360-file-1?architectural-plan.pdf'
                        },
                        last_modified_time: '2025-08-01T12:00:00Z' // Fixed property name
                    },
                    relationships: {
                        project: {
                            data: {
                                id: 'proj_1'
                            }
                        }
                    }
                }, 
                {
                    id: 'bim360-file-2',
                    attributes: {
                        name: 'structural-design.dwg',
                        version_number: '2.1',
                        length: 3072000,
                        download: {
                            href: 'https://autodesk.com/bim360/id=bim360-file-2?structural-design.dwg'
                        },
                        last_modified_time: '2025-08-02T14:30:00Z' 
                    },
                    relationships: {
                        project: {
                            data: {
                                id: 'proj_1'
                            }
                        }
                    }
                }
            ]
        };

        const commonFiles: CommonFile[] = mockBIM360Response.data.map(item => ({
            source: 'bim360',
            projectId: item.relationships.project.data.id,
            fileId: item.id,
            name: item.attributes.name,
            version: item.attributes.version_number,
            size: item.attributes.length,
            downloadUrl: item.attributes.download.href,
            updatedAt: item.attributes.last_modified_time 
        }));

        return commonFiles;
    }
}