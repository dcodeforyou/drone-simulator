import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { InputService } from 'src/app/services/input.service';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})
export class InputsComponent implements OnInit {

  inputForm!: FormGroup;
  fileData: string = '';
  enableSimulation: Subject<boolean> = this.inputService.enableSimulation;

  constructor(private fb: FormBuilder, private inputService: InputService) { 
    
  }

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      markers: this.fb.array([]),
    });

    for(let i = 0; i < 2; i++) {
      this.addMarker();
    }
  }

  getArrayFormItem(): FormGroup {
    return this.fb.group({
      time: new FormControl(null, Validators.required),
      longitude: new FormControl(null, Validators.required),
      latitude: new FormControl(null, Validators.required),
    });
  }

  onFileUpload(file: any): void {
    // Read input file and call fetchData with required json data.
    let fileReader: FileReader = new FileReader();
    let list = (file?.target?.files)[0];
    console.log(list);
    fileReader.onloadend = () => {
      this.fileData = fileReader.result as string;
      const markers = JSON.parse(this.fileData);
      this.inputService.enableSimulation.next(true);
      this.inputService.fetchData(markers);
    };
    fileReader.readAsText(list);
  }
  
  submitForm(): void {
    if (this.inputForm.valid) {
      this.inputService.fetchData(this.inputForm.value.markers);
      this.inputForm.reset();
    }
  }

  addMarker() {
    (this.inputForm.get('markers') as FormArray).push(this.getArrayFormItem());
  }

  getMarkerControls() {
    // console.log((this.inputForm.get('markers') as FormArray).controls);
    return (this.inputForm.get('markers') as FormArray).controls;
  }

}
