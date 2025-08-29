import { ICDEProvider, CommonFile, ProviderConfig } from './../interface/cde-provider.interface';
import { BIM360Provider } from './../providers/bim360.provider';
import { ProcoreProvider } from './../providers/procore.provider';
import { ViewpointProvider, TrimbleProvider, AccnoexProvider } from './../providers/stubbed.providers';

type ProviderName = 'bim360' | 'procore' | 'viewpoint' | 'trimble' | 'accnoex';

const providerRegistry: Record<ProviderName, new () => ICDEProvider> = {
  bim360: BIM360Provider,
  procore: ProcoreProvider,
  viewpoint: ViewpointProvider,
  trimble: TrimbleProvider,
  accnoex: AccnoexProvider
};

export class AggregationService {
  
  async getAggregatedFiles(
    providerNames: ProviderName[], 
    providerConfigs: Record<ProviderName, ProviderConfig>,
    projectId?: string
    ): Promise<CommonFile[]> 
    {
    console.log(`Aggregating files from providers: ${providerNames.join(', ')}`);
    
    const providers: ICDEProvider[] = providerNames.map(name => {
      const ProviderClass = providerRegistry[name];
      const providerInstance = new ProviderClass();
        if (providerConfigs[name]) {
            providerInstance.initialize(providerConfigs[name]);
        }
        if (!ProviderClass) {
            throw new Error(`Unsupported provider: ${name}`);
        }
      return providerInstance;
    });

    const results = await Promise.allSettled(
      providers.map(provider => provider.fetchFiles(projectId))
    );

    const allFiles: CommonFile[] = [];
    
    results.forEach((result, index) => {
      const providerName = providerNames[index];
      
      if (result.status === 'fulfilled') {
        console.log(`${providerName}: fetched ${result.value.length} files`);
        allFiles.push(...result.value);
      } else {
        console.error(`${providerName}: failed -`, result.reason.message);
      }
    });

    return this.processFiles(allFiles);
  }

  private processFiles(files: CommonFile[]): CommonFile[] {
    const fileMap = new Map<string, CommonFile>();
    
    for (const file of files) {
      const key = `${file.projectId}-${file.name}`;
      const existingFile = fileMap.get(key);
      
      if (!existingFile || new Date(file.updatedAt) > new Date(existingFile.updatedAt)) {
        fileMap.set(key, file);
      }
    }
    
    const uniqueFiles = Array.from(fileMap.values());
    return uniqueFiles.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}
