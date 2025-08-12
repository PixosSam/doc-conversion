import request from 'supertest';
import app from '../src/app';

// Mock the Puppeteer browser used by the server so tests don't launch a real browser
jest.mock('../src/browser', () => {
  const mockPage = {
    setViewport: jest.fn(async () => {}),
    goto: jest.fn(async () => {}),
    setContent: jest.fn(async () => {}),
    pdf: jest.fn(async () => Buffer.from('%PDF-1.7\n')), // minimal-like PDF bytes
    close: jest.fn(async () => {}),
  };
  const mockBrowser = {
    newPage: jest.fn(async () => mockPage),
  };
  return {
    getBrowser: jest.fn(async () => mockBrowser),
  };
});

describe('API Endpoints', () => {
  test('POST /v1/convert/html/pdf returns application/pdf', async () => {
    const res = await request(app)
      .post('/v1/convert/html/pdf')
      .send({ source: '<html><body><h1>Hello</h1></body></html>' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
    expect(res.headers['content-disposition']).toMatch(/attachment; filename=Document\.pdf/);
    expect(Buffer.isBuffer(res.body)).toBe(true);
  });

  test('POST /v1/convert/html/pdf validates missing source', async () => {
    const res = await request(app)
      .post('/v1/convert/html/pdf')
      .send({})
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body && Array.isArray(res.body.errors)).toBe(true);
  });

  test('POST /v1/convert/md/pdf returns application/pdf', async () => {
    const res = await request(app)
      .post('/v1/convert/md/pdf')
      .send({ source: '# Title' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
    expect(Buffer.isBuffer(res.body)).toBe(true);
  });
});


