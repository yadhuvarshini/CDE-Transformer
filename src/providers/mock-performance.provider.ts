import { ICDEProvider, CommonFile } from './../interface/cde-provider.interface';

export class MockPerformanceProvider implements ICDEProvider {
  async fetchFiles(projectId?: string): Promise<CommonFile[]> {
    const files: CommonFile[] = [];
    const now = new Date();
    const fileCount = 125; 
    
    for (let i = 1; i <= fileCount; i++) {
      const projectNum = projectId ? parseInt(projectId.split('_')[1]) : (i % 5 + 1);
      const hoursAgo = Math.floor(Math.random() * 240); 
      const fileDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      files.push({
        source: 'bim360',
        projectId: projectId || `proj_${projectNum}`,
        fileId: `bim_file_${i}`,
        name: `drawing-${Math.floor(i / 25) + 1}.pdf`,
        version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
        size: Math.floor(Math.random() * 5000000) + 500000,
        downloadUrl: `https://bim360.com/files/bim_file_${i}`,
        updatedAt: fileDate.toISOString()
      });
    }
    
    return files;
  }
}