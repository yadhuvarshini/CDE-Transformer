# CDE Transformer Microservice

A high-performance Node.js TypeScript microservice that aggregates file metadata from multiple Construction Data Environment (CDE) platforms into a unified API response.

## 🚀 Features

- **Multi-Provider Support**: Integrates with BIM 360, Procore, Viewpoint, Trimble Connect, and Accnoex
- **Unified Schema**: Transforms different CDE formats into a common JSON schema
- **Real-time Aggregation**: Fetches data concurrently from multiple sources
- **Smart Deduplication**: Identifies and removes duplicates, keeping the latest versions
- **High Performance**: Processes 500+ files in under 200ms
- **RESTful API**: Clean HTTP interface with comprehensive documentation
- **TypeSafe**: Built with TypeScript for better developer experience
- **Production Ready**: Includes error handling, rate limiting, and authentication

## 📋 API Usage

### Get Aggregated Files

```bash
curl -H "X-API-KEY: your-api-key" \
  "http://localhost:3000/v1/files?providers=bim360,procore&project=proj_123"
```

**Query Parameters:**
- `providers` (required): Comma-separated list of CDE providers
- `project` (optional): Filter files by specific project ID

**Headers:**
- `X-API-KEY`: Your authentication token

**Supported Providers:** `bim360`, `procore`, `viewpoint`, `trimble`, `accnoex`

### Response Format

```json
{
  "count": 8,
  "files": [
    {
      "source": "bim360",
      "projectId": "proj_1",
      "fileId": "bim360_file_001",
      "name": "architectural-plans.pdf",
      "version": "4",
      "size": 2500000,
      "downloadUrl": "https://bim360.com/download/file_001",
      "updatedAt": "2025-07-10T12:00:00Z"
    }
  ]
}
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cde-transformer.git
   cd cde-transformer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your API keys and settings.

4. **Build and run**
   ```bash
   npm run dev
   ```

## 📦 Environment Variables

```bash
PORT=3000
NODE_ENV=development

# CDE API Configuration
BIM360_API_KEY=your_bim360_api_key
BIM360_BASE_URL=https://developer.api.autodesk.com/bim360/docs/v1

PROCORE_API_KEY=your_procore_api_key
PROCORE_BASE_URL=https://api.procore.com

VIEWPOINT_API_KEY=your_viewpoint_api_key
VIEWPOINT_BASE_URL=https://api.viewpoint.com

TRIMBLE_API_KEY=your_trimble_api_key
TRIMBLE_BASE_URL=https://connect.trimble.com

ACCNOEX_API_KEY=your_accnoex_api_key
ACCNOEX_BASE_URL=https://api.accnoex.com
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run performance test
npm run performance

# Test API locally
curl -H "X-API-KEY: test-key" "http://localhost:3000/v1/files?providers=bim360,procore"
```

## 🏗️ Architecture

### Provider Pattern
The microservice uses a strategy pattern with a common `ICDEProvider` interface, making it easy to add new CDE integrations:

```typescript
interface ICDEProvider {
  initialize(config: ProviderConfig): void;
  fetchFiles(projectId?: string): Promise<CommonFile[]>;
}
```

### Data Flow
1. **API Request** → Receives provider list and authentication
2. **Concurrent Fetching** → Calls all providers simultaneously
3. **Transformation** → Maps each provider's format to common schema
4. **Deduplication** → Removes duplicates, keeps latest versions
5. **Sorting** → Orders by update date (newest first)
6. **Response** → Returns unified JSON payload

### Performance Optimization
- Concurrent API calls with `Promise.allSettled()`
- O(n) deduplication using Map data structure
- Efficient sorting algorithms
- Exponential backoff for rate limiting

## 📊 Performance

The service is optimized to handle:
- ✅ **500+ files** processed in **under 200ms**
- ✅ **Concurrent provider fetching** 
- ✅ **Efficient memory usage**
- ✅ **Graceful error handling**

```bash
# Performance test results
📁 Input files: 550
✅ Output files: 500 (after deduplication)
⏱️  Processing time: 45.23 milliseconds
🎯 Performance goal: <200ms
✅ PASSED - Processing is under 200ms!
```

## 🔧 Development

### Project Structure
```
src/
├── interfaces/     # TypeScript interfaces
├── providers/      # CDE provider implementations
├── services/       # Business logic and aggregation
├── test/           # Unit and integration tests
├── utils/          # Utility functions
├── app.ts          # Express application
└── index.ts        # Entry point
```

### Adding New Providers
1. Implement the `ICDEProvider` interface
2. Add to provider registry in `aggregation.service.ts`
3. Update TypeScript types as needed
4. Add tests for the new provider

## 📚 API Documentation

Interactive Swagger documentation is available at:
`http://localhost:3000/api-docs`

## 🚀 Deployment

### Docker Deployment
```bash
docker build -t cde-transformer .
docker run -p 3000:3000 --env-file .env cde-transformer
```

### Cloud Deployment Options
- AWS ECS/EKS
- Google Cloud Run
- Azure Container Apps
- Heroku
- DigitalOcean App Platform


## 📈 Status

![Build Status](https://img.shields.io/github/actions/workflow/status/your-username/cde-transformer/ci.yml)
![Test Coverage](https://img.shields.io/badge/coverage-100%25-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)

---

**Built for modern construction technology stacks** 🏗️⚡
