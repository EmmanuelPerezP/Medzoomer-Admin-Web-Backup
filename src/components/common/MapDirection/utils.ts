import { Task } from '../../../interfaces';
import { Coords, ExtraDocument, ExtraElement, Point } from './types';

export const containerStyle = {
  width: '100%',
  height: '100%'
};

// default New York's coordinates
export const centerCoords: Coords = {
  lng: 40.73061,
  lat: -73.935242
};

export const isFullscreen = (element: HTMLElement) => {
  const doc = document as ExtraDocument;
  return (
    (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement) ===
    element
  );
};

export const requestFullscreen = (element: HTMLElement) => {
  const el = element as ExtraElement;
  if (el.requestFullscreen) {
    void el.requestFullscreen();
  } else if (el.webkitRequestFullScreen) {
    void el.webkitRequestFullScreen();
  } else if (el.mozRequestFullScreen) {
    void el.mozRequestFullScreen();
  } else if (el.msRequestFullScreen) {
    void el.msRequestFullScreen();
  }
};

export const exitFullscreen = () => {
  const doc = document as ExtraDocument;
  if (doc.exitFullscreen) {
    void doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    void doc.webkitExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    void doc.mozCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    void doc.msExitFullscreen();
  }
};

export const convertTasksToWaypoints = (tasks: Task[]): Point[] => {
  const waypoints: Point[] = [];
  // eslint-disable-next-line
  tasks.map((task) => {
    if (task.point && task.destinationType) {
      waypoints.push({
        coords: task.point,
        type: task.destinationType
      });
    }
  });

  return waypoints;
};
