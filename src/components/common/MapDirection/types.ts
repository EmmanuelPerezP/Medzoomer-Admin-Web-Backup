export interface Point {
  coords: Coords;
  type: 'pharmacy' | 'customer';
}

export interface IMapDirectionProps {
  waypoints: Point[];
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface ExtraDocument
  extends Document,
    Partial<{
      webkitFullscreenElement: Element | null;
      mozFullScreenElement: Element | null;
      msFullscreenElement: Element | null;
      webkitExitFullscreen: () => void;
      mozCancelFullScreen: () => void;
      msExitFullscreen: () => void;
    }> {}

export interface ExtraElement
  extends HTMLElement,
    Partial<{
      webkitRequestFullScreen: () => void;
      mozRequestFullScreen: () => void;
      msRequestFullScreen: () => void;
    }> {}

export type TravelModes = 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKIN'
