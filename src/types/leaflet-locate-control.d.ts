
declare namespace L {
  namespace Control {
    function locate(options?: LocateOptions): any;
  }

  interface LocateOptions {
    position?: string;
    flyTo?: boolean;
    drawCircle?: boolean;
    followCircle?: boolean;
    drawMarker?: boolean;
    showPopup?: boolean;
    strings?: {
      title?: string;
      popup?: string;
      metersUnit?: string;
      feetUnit?: string;
      outsideMapBoundsMsg?: string;
      locateOptions?: string;
    };
    locateOptions?: {
      enableHighAccuracy?: boolean;
      watch?: boolean;
      setView?: boolean | string;
      maxZoom?: number;
    };
    onLocationError?: (err: any) => void;
    onLocationOutsideMapBounds?: () => void;
    onLocationFound?: (evt: any) => void;
    icon?: string;
    iconLoading?: string;
    metric?: boolean;
    keepCurrentZoomLevel?: boolean;
    returnToPrevBounds?: boolean;
    stopFollowingOnDrag?: boolean;
    clickBehavior?: {
      inView?: string;
      outOfView?: string;
      inViewNotFollowing?: string;
    };
  }
}
