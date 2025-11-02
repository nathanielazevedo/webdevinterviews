import { Router } from 'express';
import { LocationService } from '../services/location.service.js';
import { logger } from '../utils/logger.js';
import { sendSuccessResponse, sendErrorResponse, asyncHandler } from '../utils/response.js';
import { validateRequiredFields } from '../utils/validation.js';
import { ENV, HTTP_STATUS } from '../utils/constants.js';

const log = logger;

export function createLocationRoutes() {
  const router = Router();

  router.get('/points', asyncHandler(async (req, res) => {
    log.info('Fetching all location points');

    const points = await LocationService.getAllLocationPoints();

    sendSuccessResponse(res, { points }, 'Location points fetched successfully');
  }));

  router.post('/geocode', 
    validateRequiredFields(['location']),
    asyncHandler(async (req, res) => {
      const { location } = req.body;

      if (!ENV.GEO_KEY) {
        sendErrorResponse(
          res, 
          'GEO_KEY environment variable not set', 
          'Geocoding service not configured',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
        return;
      }

      const result = await LocationService.geocodeLocation(location, ENV.GEO_KEY);

      sendSuccessResponse(res, result, 'Location geocoded successfully');
    })
  );

  return router;
}