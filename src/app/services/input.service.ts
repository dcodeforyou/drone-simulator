import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IMarker } from '../models/marker.model';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  rowData: { time: number; longitude: number; latitude: number }[] = [];
  enableSimulation: Subject<boolean> = new Subject();
  mapMarkers: IMarker[] = [];
  map?: google.maps.Map;


  constructor() { }

  fetchData(markers: any[]): void {
      console.log(markers);
      markers.forEach((marker: any) => {
        this.rowData.push({ time: marker.time, longitude: marker.longitude, latitude: marker.latitude });
      });

      this.mapMarkers = [];
      this.rowData.forEach((data: { time: number; longitude: number; latitude: number }) => {
        this.mapMarkers.push({
          position: new google.maps.LatLng(data.latitude, data.longitude),
          map: this.map,
          time: data.time,
        });
      });
      this.enableSimulation.next(true);
  }

  
}
