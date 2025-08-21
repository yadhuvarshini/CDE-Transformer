import { AggregationService } from './services/aggregation.service';
import { CommonFile } from './interface/cde-provider.interface';

class MockPerformanceProvider {
  async fetchFiles(projectId?: string): Promise<CommonFile[]> {
    const files: CommonFile[] = [];
    const now = new Date();
    
    for (let i = 1; i <= 500; i++) {
      const projectNum = i % 10 + 1; 
      const hoursAgo = Math.floor(Math.random() * 720); 
      const fileDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      files.push({
        source: 'bim360',
        projectId: `proj_${projectNum}`,
        fileId: `file_${i}`,
        name: `document-${Math.floor(i / 50) + 1}.pdf`, 
        version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
        size: Math.floor(Math.random() * 10000000) + 100000, 
        downloadUrl: `https://bim360.com/files/file_${i}`,
        updatedAt: fileDate.toISOString()
      });
    }
    
    for (let i = 0; i < 50; i++) {
      const duplicateIndex = Math.floor(Math.random() * 500);
      const duplicateFile = { ...files[duplicateIndex] };
      
      const hoursDiff = Math.random() > 0.5 ? 10 : -10;
      const newDate = new Date(new Date(duplicateFile.updatedAt).getTime() + hoursDiff * 60 * 60 * 1000);
      
      duplicateFile.fileId = `duplicate_${i}`;
      duplicateFile.updatedAt = newDate.toISOString();
      duplicateFile.version = `${parseFloat(duplicateFile.version) + (hoursDiff > 0 ? 0.1 : -0.1)}`.slice(0, 3);
      
      files.push(duplicateFile);
    }
    
    return files;
  }
}

async function runPerformanceTest() {
  console.log('Starting performance test with 500+ files...');
  
  const service = new AggregationService();
  const mockProvider = new MockPerformanceProvider();
  
  const testFiles = await mockProvider.fetchFiles();
  console.log(`Generated ${testFiles.length} test files`);
  
  const startTime = performance.now();
  
  const result = (service as any).processFiles(testFiles);
  
  const endTime = performance.now();
  const processingTime = endTime - startTime;
  
  console.log('\nPerformance Test Results:');
  console.log(`Input files: ${testFiles.length}`);
  console.log(`Output files: ${result.length} (after deduplication)`);
  console.log(`Processing time: ${processingTime.toFixed(2)} milliseconds`);
  console.log(`Performance goal: <200ms`);
  
  if (processingTime < 200) {
    console.log('PASSED - Processing is under 200ms!');
  } else {
    console.log('FAILED - Processing is over 200ms');
  }
  
  const filesByProject: Record<string, number> = {};
  result.forEach((file: CommonFile) => {
    filesByProject[file.projectId] = (filesByProject[file.projectId] || 0) + 1;
  });
  
  console.log('\nFiles by project:');
  Object.entries(filesByProject).forEach(([projectId, count]) => {
    console.log(`   ${projectId}: ${count} files`);
  });
  
  console.log('\nNewest files:');
  result.slice(0, 3).forEach((file: CommonFile, index: number) => {
    const date = new Date(file.updatedAt).toLocaleDateString();
    console.log(`   ${index + 1}. ${file.name} (v${file.version}) - ${date} - ${file.source}`);
  });
}

runPerformanceTest().catch(console.error);