import { AggregationService } from '../services/aggregation.service';

const mockConsole = {
    log: jest.fn(),
    error: jest.fn()
}

global.console = mockConsole as any;

describe('AggregationService', () => {
    let service: AggregationService;

    beforeEach(() => {
        service = new AggregationService();
        jest.clearAllMocks();
    });

    it('should dedublipcate and gives newer version', async () => {
        const testfiles = [
            {
                source: 'bim360',
                projectId: 'proj_1',
                fileId: 'file_001',
                name: 'test.pdf',
                version: '4',
                size: 2500000,
                downloadUrl: 'https://bim360.com/download/file_001',
                updatedAt: '2025-07-10T12:00:00Z'
            },
            {
                source: 'bim360',
                projectId: 'proj_1',
                fileId: 'file2',
                name: 'test.pdf',
                version: '3',
                size: 2000000,
                downloadUrl: 'https://bim360.com/download/file_002',
                updatedAt: '2025-07-09T12:00:00Z' 
            }
        ];

        const result = (service as any).processFiles(testfiles);
        expect(result).toHaveLength(1);
        expect(result[0].source).toBe('bim360');
        expect(result[0].projectId).toBe('proj_1');
        expect(result[0].version).toBe('4');
        expect(result[0].updatedAt).toBe('2025-07-10T12:00:00Z');
    });

    it('should handle empty file array', () =>{
        const result = (service as any).processFiles([]);
        expect(result).toHaveLength(0);
    });

    it('should handle files with different projectIds as separate', () => {
        const testFiles = [
        {
            source: 'bim360',
            projectId: 'proj_1',
            fileId: 'file1',
            name: 'test.pdf',
            version: '1',
            size: 1000,
            downloadUrl: 'https://test.com/file1',
            updatedAt: '2025-07-10T12:00:00Z'
        },
        {
            source: 'procore',
            projectId: 'proj_2', // Different project ID
            fileId: 'file2', 
            name: 'test.pdf', // Same name but different project
            version: '1',
            size: 1000,
            downloadUrl: 'https://test.com/file2',
            updatedAt: '2025-07-10T12:00:00Z'
        }
        ];
        
        const result = (service as any).processFiles(testFiles);
        expect(result).toHaveLength(2); // Both should be kept
    });

});