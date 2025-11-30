import request from 'supertest';
import app from '../../api/server';

describe('API Integration Tests', () => {
  it('should respond with health check', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('ok');
  });

  it('should respond with API health', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('security');
  });

  it('should respond with hello endpoint', async () => {
    const response = await request(app).get('/api/hello');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Hello from the Cabana API!');
  });

  it('should return 404 for non-existent endpoint', async () => {
    const response = await request(app).get('/non-existent');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('not_found');
  });
});