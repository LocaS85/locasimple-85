
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { verifyApiConnections } from '@/utils/apiUtils';
import { MAPBOX_TOKEN } from '@/config/environment';

interface AppDiagnostics {
  status: 'checking' | 'healthy' | 'issues';
  issues: string[];
  apiStatus: Record<string, boolean>;
  browserCapabilities: {
    geolocation: boolean;
    webGL: boolean;
    localStorage: boolean;
    permissions: boolean;
  };
  lastChecked: Date | null;
}

/**
 * Hook for checking and monitoring app health
 */
export const useAppDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<AppDiagnostics>({
    status: 'checking',
    issues: [],
    apiStatus: {},
    browserCapabilities: {
      geolocation: false,
      webGL: false,
      localStorage: false,
      permissions: false
    },
    lastChecked: null
  });

  const runDiagnostics = async () => {
    setDiagnostics(prev => ({ ...prev, status: 'checking' }));
    
    const issues: string[] = [];
    const capabilities = {
      geolocation: false,
      webGL: false,
      localStorage: false,
      permissions: false
    };
    
    // Check API connections
    const apiStatus = await verifyApiConnections();
    
    // Check for Mapbox token
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
      issues.push('Token Mapbox manquant ou invalide');
    }
    
    // Check for API connection issues
    for (const [api, status] of Object.entries(apiStatus)) {
      if (!status) {
        issues.push(`Problème de connexion à l'API ${api}`);
      }
    }
    
    // Check browser capabilities
    
    // Geolocation
    capabilities.geolocation = 'geolocation' in navigator;
    if (!capabilities.geolocation) {
      issues.push('Géolocalisation non supportée par votre navigateur');
    }
    
    // WebGL
    try {
      const canvas = document.createElement('canvas');
      capabilities.webGL = !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      if (!capabilities.webGL) {
        issues.push('WebGL non supporté par votre navigateur (nécessaire pour la carte)');
      }
    } catch (e) {
      capabilities.webGL = false;
      issues.push('Erreur lors de la vérification de WebGL');
    }
    
    // LocalStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      capabilities.localStorage = true;
    } catch (e) {
      capabilities.localStorage = false;
      issues.push('LocalStorage non disponible (nécessaire pour sauvegarder vos préférences)');
    }
    
    // Permissions API
    capabilities.permissions = 'permissions' in navigator;
    
    // Update state with diagnostics results
    setDiagnostics({
      status: issues.length > 0 ? 'issues' : 'healthy',
      issues,
      apiStatus,
      browserCapabilities: capabilities,
      lastChecked: new Date()
    });
    
    // Show toast for issues
    if (issues.length > 0) {
      toast.warning(`${issues.length} problème(s) détecté(s)`, {
        description: issues[0] + (issues.length > 1 ? ` et ${issues.length - 1} autre(s)` : ''),
        duration: 5000
      });
    }
  };

  // Run diagnostics on mount
  useEffect(() => {
    runDiagnostics();
    
    // Set up interval to run diagnostics periodically
    const interval = setInterval(() => {
      runDiagnostics();
    }, 15 * 60 * 1000); // Every 15 minutes
    
    return () => clearInterval(interval);
  }, []);

  return {
    diagnostics,
    runDiagnostics
  };
};

export default useAppDiagnostics;
