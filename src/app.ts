import express from 'express';
import 'dotenv/config'; // This loads environment variables from .env
import {AggregationService} from './services/aggregation.service';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

import {CommonFile, ProviderConfig} from './interface/cde-provider.interface';

import { BIM360Provider } from './providers/bim360.provider';
import { ProcoreProvider } from './providers/procore.provider';

const PORT = process.env.PORT || 5000;

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CDE Transformer API',
            version: '1.0.0',
            description: 'API for aggregating files from various CDE providers'
        },
        servers: [ 
            {
                url: `http://localhost:${PORT}`,
                description:`Development server`,
            }
        ]
    },
    apis: ['./src/app.ts'] 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }'
}));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CDE Transformer microservice is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-KEY
 *       description: API key for authentication
 *   schemas:
 *     CommonFile:
 *       type: object
 *       properties:
 *         source:
 *           type: string
 *           enum: [bim360, procore, viewpoint, trimble, accnoex]
 *           example: "bim360"
 *         projectId:
 *           type: string
 *           example: "proj_1"
 *         fileId:
 *           type: string
 *           example: "file_001"
 *         name:
 *           type: string
 *           example: "architectural-plans.pdf"
 *         version:
 *           type: string
 *           example: "4"
 *         size:
 *           type: integer
 *           example: 2500000
 *         downloadUrl:
 *           type: string
 *           example: "https://bim360.com/download/file_001"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-10T12:00:00Z"
 */

/**
 * @swagger
 * /v1/files:
 *   get:
 *     summary: Get aggregated files from multiple CDE providers
 *     description: Fetches file metadata from specified construction CDE platforms, transforms to common schema, deduplicates, and returns sorted results.
 *     tags: [Files]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: providers
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of providers (bim360,procore,viewpoint,trimble,accnoex)
 *         example: "bim360,procore,viewpoint"
 *       - in: query
 *         name: project
 *         schema:
 *           type: string
 *         description: Optional project ID to filter files
 *         example: "proj_1"
 *     responses:
 *       200:
 *         description: Successfully aggregated files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 files:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CommonFile'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized - API key missing or invalid
 *       500:
 *         description: Internal server error
 */

app.get('/v1/files', async (req, res) => {
    try {
        const { providers, project } = req.query;
        const apiKey = req.headers['x-api-key'] as string;
        console.log(`Fetching files for provider: ${providers}, projectId: ${project}`);

        if(!providers) {
            return res.status(400).json({ error: 'Provider query parameter is required' });
        }

        if(!apiKey){
            return res.status(400).json({ error: 'API key is required' });
        }

        const providerNames = providers.toString().split(',') as Array<'bim360' | 'procore' | 'viewpoint' | 'trimble' | 'accnoex'>;
        const projectId = project ? project.toString() : undefined;
        
        const result: CommonFile[] = [];

        const validProviders: typeof providerNames = providerNames.filter(name => ['bim360', 'procore', 'viewpoint', 'trimble', 'accnoex'])

        if(validProviders.length === 0) {
            console.warn('No valid providers specified')
        }

        const providerConfigs: Record<string, ProviderConfig> = {};
        validProviders.forEach(providerName => {
            providerConfigs[providerName] = {
                apiKey: apiKey,
                baseUrl: process.env[`${providerName.toUpperCase()}_BASE_URL`] 
            };
        }); 


        const aggregationService = new AggregationService();
        const files = await aggregationService.getAggregatedFiles(validProviders, providerConfigs, projectId);
        
        res.json({
            count:files.length,
            files:files
        });

    } catch (error) {
        console.error('Error in /v1/files endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}) 

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Files API: http://localhost:${PORT}/v1/files?providers=bim360,procore`);
});

export default app;  