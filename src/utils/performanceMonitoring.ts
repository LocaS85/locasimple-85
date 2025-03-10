
interface PerformanceMarker {
  start: number;
  end?: number;
  duration?: number;
}

// Store performance markers
const performanceMarkers: Record<string, PerformanceMarker> = {};

/**
 * Start measuring performance for a specific operation
 * @param markerId Unique identifier for the operation
 * @returns The current timestamp
 */
export const startPerformanceMarker = (markerId: string): number => {
  const startTime = performance.now();
  performanceMarkers[markerId] = { start: startTime };
  return startTime;
};

/**
 * End measuring performance for a specific operation
 * @param markerId Unique identifier for the operation
 * @param logToConsole Whether to log the result to console
 * @returns The duration in milliseconds
 */
export const endPerformanceMarker = (markerId: string, logToConsole = true): number | undefined => {
  const marker = performanceMarkers[markerId];
  if (!marker) {
    console.warn(`No performance marker found with id: ${markerId}`);
    return undefined;
  }
  
  const endTime = performance.now();
  const duration = endTime - marker.start;
  
  performanceMarkers[markerId] = {
    ...marker,
    end: endTime,
    duration
  };
  
  if (logToConsole) {
    console.log(`🕒 Performance: ${markerId} took ${duration.toFixed(2)}ms`);
  }
  
  return duration;
};

/**
 * Get all performance markers
 * @returns All recorded performance markers
 */
export const getAllPerformanceMarkers = () => {
  return { ...performanceMarkers };
};

/**
 * Clear all performance markers
 */
export const clearPerformanceMarkers = () => {
  Object.keys(performanceMarkers).forEach(key => {
    delete performanceMarkers[key];
  });
};

/**
 * Measure the execution time of a function
 * @param fn Function to measure
 * @param markerId Unique identifier for the operation
 * @returns The function result
 */
export async function measurePerformance<T>(
  fn: () => Promise<T> | T,
  markerId: string
): Promise<T> {
  startPerformanceMarker(markerId);
  try {
    const result = await fn();
    endPerformanceMarker(markerId);
    return result;
  } catch (error) {
    endPerformanceMarker(markerId);
    throw error;
  }
}
