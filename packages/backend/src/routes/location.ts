import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

// Declare fetch for Node.js compatibility
declare const fetch: typeof globalThis.fetch;

const log = logger;
const prisma = new PrismaClient();

export function createLocationRoutes() {
  const router = Router();

  router.get('/points', async (req: Request, res: Response) => {
    try {
      log.info('Fetching all location points');

      const points = await prisma.locationPoint.findMany({
        orderBy: {
          created_at: 'desc'
        }
      });

      log.info('Location points retrieved successfully', { count: points.length });

      res.json({ points });
    } catch (error) {
      log.error('Error fetching location points:', error);
      res.status(500).json({ error: 'Failed to fetch location points' });
    }
  });

  router.post('/geocode', async (req: Request, res: Response) => {
    try {
      const { location } = req.body;

      if (!location) {
        return res.status(400).json({ error: 'Location is required' });
      }

      log.info('Geocoding location', { location });

      // Use ipgeolocation.io API for geocoding
      const key = process.env.GEO_KEY;
      if (!key) {
        log.error('GEO_KEY environment variable not set');
        return res.status(500).json({ error: 'Geocoding service not configured' });
      }

      const url = `https://api.ipgeolocation.io/v2/ipgeo?apiKey=${key}&ip=${location}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch geo data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Log the full response for debugging
      log.info('Geocoding API response', { data });

      // Check if the API returned an error
      if (data.message || data.error) {
        log.error('Geocoding API returned an error', { data });
        return res.status(500).json({ error: 'Geocoding service returned an error' });
      }

      // Validate coordinates
      const latitude = parseFloat(data.location.latitude);
      const longitude = parseFloat(data.location.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        log.error('Invalid coordinates received from geocoding API', {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          fullResponse: data
        });
        return res.status(500).json({ error: 'Invalid coordinates received from geocoding service' });
      }

      log.info('Location geocoded successfully', {
        location,
        latitude,
        longitude
      });

      // Store unique location point in database
      try {
        await prisma.locationPoint.upsert({
          where: {
            latitude_longitude: {
              latitude,
              longitude
            }
          },
          update: {
            country: data.location.country_name,
            region: data.location.state_prov,
            locality: data.location.city
          },
          create: {
            latitude,
            longitude,
            country: data.location.country_name,
            region: data.location.state_prov,
            locality: data.location.city
          }
        });
        log.info('Location point stored/updated in database');
      } catch (dbError) {
        log.error('Failed to store location point in database:', dbError);
        // Don't fail the request if DB storage fails
      }

      res.json({
        location,
        latitude,
        longitude,
        country: data.location.country_name,
        region: data.location.state_prov,
        locality: data.location.city,
        ip: data.ip
      });
    } catch (error) {
      log.error('Error geocoding location:', error);
      res.status(500).json({ error: 'Failed to geocode location' });
    }
  });

  return router;
}