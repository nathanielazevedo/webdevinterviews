import { Router } from 'express';
import { LocationService } from '../services/location.service.js';
import { sendSuccessResponse, sendErrorResponse, asyncHandler } from '../utils/response.js';
import { ENV, HTTP_STATUS } from '../utils/constants.js';

export function createLocationRoutes() {
  const router = Router();

  router.get('/points', asyncHandler(async (req, res) => {

    const points = await LocationService.getAllLocationPoints();

    sendSuccessResponse(res, { points }, 'Location points fetched successfully');
  }));

  router.post('/geocode', 
    asyncHandler(async (req, res) => {
      // Get client IP from request headers (handles proxies, load balancers, etc.)
      const clientIP = req.ip || 
                      req.headers['x-forwarded-for'] || 
                      req.headers['x-real-ip'] || 
                      req.connection?.remoteAddress || 
                      req.socket?.remoteAddress ||
                      '127.0.0.1';

      // Handle IPv6 localhost and array of IPs
      const ip = clientIP === '::1' ? '127.0.0.1' : (Array.isArray(clientIP) ? clientIP[0] : clientIP);

      // Skip geocoding for localhost/private IPs during development
      if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        // Return a mock result for development
        const mockResult = {
          location: ip,
          latitude: 37.7749, // San Francisco coordinates as fallback
          longitude: -122.4194,
          country: 'Development',
          region: 'Local',
          locality: 'Localhost',
          ip
        };
        
        sendSuccessResponse(res, mockResult, 'Mock location for development');
        return;
      }

      if (!ENV.GEO_KEY) {
        sendErrorResponse(
          res, 
          'GEO_KEY environment variable not set', 
          'Geocoding service not configured',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
        return;
      }

      try {
        const result = await LocationService.geocodeLocation(ip, ENV.GEO_KEY);
        sendSuccessResponse(res, result, 'Location geocoded successfully');
      } catch (error) {
        // Handle geocoding errors gracefully
        const errorMessage = error instanceof Error ? error.message : 'Geocoding failed';
        
        // Return a fallback result instead of failing completely
        const fallbackResult = {
          location: ip,
          latitude: 0,
          longitude: 0,
          country: 'Unknown',
          region: 'Unknown',
          locality: 'Unknown', 
          ip
        };

        sendSuccessResponse(res, fallbackResult, `Geocoding failed, using fallback: ${errorMessage}`);
      }
    })
  );

  return router;
}
