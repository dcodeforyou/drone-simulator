import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { IMarker } from 'src/app/models/marker.model';
import { InputService } from 'src/app/services/input.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer', { static: false, read: ElementRef }) gmap!: ElementRef;
  enableSimulation: Subject<boolean> = this.inputService.enableSimulation;
  markers: IMarker[] = this.inputService.mapMarkers;
  dronePathArray: google.maps.LatLng[] = [];
  droneSliderValue = 0;
  pauseSimulation = false;
  enableSlider = false;
  droneRoute: any;
  totalRoute: number = 0;
  map?: google.maps.Map = this.inputService.map;
  mapOptions: google.maps.MapOptions = {};

  
  constructor(private inputService: InputService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.mapOptions = {
      center: this.markers[0] ? new google.maps.LatLng(
            this.markers[0].position.lat(),
            this.markers[0].position.lng()
          ) : new google.maps.LatLng(0, 0),
      zoom: 2,
      mapTypeId: 'satellite'
    };
    this.map = new google.maps.Map(this.gmap?.nativeElement, this.mapOptions);
    
  }

  getDronePath() {
    return this.markers.map((marker) => {
      return { lat: marker.position.lat(), lng: marker.position.lng() };
    })
  }

  startSimulation(): void {
    // Add Markers in map, only if marker information available
    this.markers = [];
    this.markers.forEach((markerInfo: google.maps.MarkerOptions) => {
      const marker = new google.maps.Marker({
        ...markerInfo,
      });
      marker.setMap(this.map as google.maps.Map);
    });
    console.log("DRONE SIMULATION START")
    this.pauseSimulation = false;
    this.dronePathArray = [];
    this.droneSliderValue = 0;
    this.enableSlider = true;
    this.markers = this.inputService.mapMarkers;

    const symbolTwo = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      strokeColor: "#086a27",
      fillColor: "#086a27",
      fillOpacity: 1
    };

    this.droneRoute = this.droneRoute ? this.droneRoute : new google.maps.Polyline({
      path: this.getDronePath(),
      geodesic: true,
      icons: [
        {
          icon: symbolTwo,
          offset: '0%',
        },
      ],
      map: this.map,
      strokeColor: '#90ee90',
    });

    for (let mi = 0; mi < this.markers.length - 1; mi++) {
      const factor = 1 / this.markers[mi + 1].time;
      const longitudeF = this.markers[mi].position.lng();
      const longitudeT = this.markers[mi + 1].position.lng();
      const latitudeF = this.markers[mi].position.lat();
      const latitudeT = this.markers[mi + 1].position.lat();
      for (let f = 0; f <= 1; f += factor) {
        const curLat = latitudeF + (latitudeT - latitudeF) * f;
        const curLng = longitudeF + (longitudeT - longitudeF) * f;
        this.dronePathArray.push(new google.maps.LatLng(curLat, curLng));
      }
    }
    
    let latlngbounds = new google.maps.LatLngBounds();
    for (var dc = 0; dc < this.dronePathArray.length; dc++) {
        latlngbounds.extend(this.dronePathArray[dc]);
    }
    this.map!.fitBounds(latlngbounds);
    this.totalRoute = 100 / this.dronePathArray.length;
    console.log('ROUTE: ', this.totalRoute);
    this.simulateDrone();
  }

  simulateDrone(): void {
    
    if (this.pauseSimulation) return;
    console.log(this.droneSliderValue);
    if(this.droneSliderValue < this.dronePathArray.length - 1) {
      setTimeout(() => {
        const icons = this.droneRoute.get('icons');
        icons[0].offset = this.droneSliderValue * this.totalRoute + '%';
        this.droneRoute.set('icons', icons);
        this.droneSliderValue += 1;
        this.simulateDrone();
      }, this.totalRoute * 100);
    } else {
      const icons = this.droneRoute.get('icons');
      icons[0].offset = 100 + '%';
      this.enableSlider = false;
    }
  }

  togglePlay(): void {
    this.pauseSimulation = !this.pauseSimulation;
    if (!this.pauseSimulation) {
      this.simulateDrone();
    }
  }

  disableSimulation(): void {
    this.inputService.enableSimulation.next(false);
  }


}
