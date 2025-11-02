import { prisma, dbLog } from '../config/database.js';
import { logger } from '../utils/logger.js';

// Declare fetch for Node.js compatibility
declare const fetch: typeof globalThis.fetch;

const log = logger;

export interface LocationPoint {
  id: number;
  latitude: number;
  longitude: number;
  country: string | null;
  region: string | null;
  locality: string | null;
  created_at: Date;
}

export interface GeocodeResult {
  location: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string;
  locality: string;
  ip: string;
}

export class LocationService {
  
  /**
   * Get all location points
   */
  static async getAllLocationPoints(): Promise<LocationPoint[]> {
    try {
      log.info('Fetching all location points');

      const points = await prisma.locationPoint.findMany({
        orderBy: {
          created_at: 'desc'
        }
      });

      log.info('Location points retrieved successfully', { count: points.length });
      return points;
    } catch (error) {
      log.error('Error fetching location points:', error);
      throw error;
    }
  }

  /**
   * Geocode an IP address using external API
   */
  static async geocodeLocation(location: string, apiKey: string): Promise<GeocodeResult> {
    if (!apiKey) {
      throw new Error('Geocoding service not configured - missing API key');
    }

    log.info('Geocoding location', { location });

    const url = `https://api.ipgeolocation.io/v2/ipgeo?apiKey=${apiKey}&ip=${location}`;
    
    try {
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
        throw new Error('Geocoding service returned an error');
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
        throw new Error('Invalid coordinates received from geocoding service');
      }

      const result: GeocodeResult = {
        location,
        latitude,
        longitude,
        country: data.location.country_name,
        region: data.location.state_prov,
        locality: data.location.city,
        ip: data.ip
      };

      log.info('Location geocoded successfully', result);

      // Store in database (don't fail the request if this fails)
      try {
        await this.storeLocationPoint(result);
        log.info('Location point stored/updated in database');
      } catch (dbError) {
        log.error('Failed to store location point in database:', dbError);
        // Continue without failing the request
      }

      return result;
    } catch (error) {
      log.error('Error during geocoding:', error);
      throw error;
    }
  }

  /**
   * Store or update a location point in the database
   */
  private static async storeLocationPoint(geocodeResult: GeocodeResult): Promise<LocationPoint> {
    try {
      return await prisma.locationPoint.upsert({
        where: {
          latitude_longitude: {
            latitude: geocodeResult.latitude,
            longitude: geocodeResult.longitude
          }
        },
        update: {
          country: geocodeResult.country,
          region: geocodeResult.region,
          locality: geocodeResult.locality
        },
        create: {
          latitude: geocodeResult.latitude,
          longitude: geocodeResult.longitude,
          country: geocodeResult.country,
          region: geocodeResult.region,
          locality: geocodeResult.locality
        }
      });
    } catch (error) {
      dbLog.error('Error storing location point:', error);
      throw error;
    }
  }
}