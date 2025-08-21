import { ProcoreProvider } from './providers/procore.provider';

async function testProcoreProvider() {
  console.log('🧪 Testing Procore Provider...');
  
  const provider = new ProcoreProvider();
  
  try {
    const files = await provider.fetchFiles('test_project_456');
    console.log('✅ Procore Provider test successful!');
    console.log(`📁 Found ${files.length} files:`);
    
    files.forEach(file => {
      console.log(`   - ${file.name} (v${file.version}) - ${file.source}`);
    });
    
  } catch (error) {
    console.error('❌ Procore Provider test failed:', error);
  }
}

testProcoreProvider();