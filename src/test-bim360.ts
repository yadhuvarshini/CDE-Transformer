import { BIM360Provider } from './providers/bim360.provider';

async function testBIM360Provider() {
  console.log('🧪 Testing BIM360 Provider...');
  
  const provider = new BIM360Provider();
  
  try {
    const files = await provider.fetchFiles('test_project_123');
    console.log('✅ BIM360 Provider test successful!');
    console.log(`📁 Found ${files.length} files:`);
    
    files.forEach(file => {
      console.log(`   - ${file.name} (v${file.version}) - ${file.source}`);
    });
    
    console.log('📋 First file details:', JSON.stringify(files[0], null, 2));
    
  } catch (error) {
    console.error('❌ BIM360 Provider test failed:', error);
  }
}

// Run the test
testBIM360Provider();