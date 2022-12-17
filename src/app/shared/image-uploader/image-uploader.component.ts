import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/core/general/service/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent implements OnInit {
  @Input() inputModel: any;
  @Input() imageurl: any;
  @Input() resetFlag: boolean = false;
  imagesrc: any;
  hasImage = false;
  @Output() inputModelChange = new EventEmitter<any>();
  selectedFile!: File;
  constructor(private dataService: DataService) {}

  ngOnInit() {}
  inputClick(file: HTMLElement) {
    console.log(file.click());
  }
  imageUpload(ev: any) {
    console.log('file: file-uploader ', ev.target.files[0]);
    this.selectedFile = ev.target.files[0];
    console.log(this.selectedFile);
    const fd = new FormData();
    fd.append('filepond', this.selectedFile, this.selectedFile.name);
    this.dataService.postMethod('media/upload', fd).subscribe(
      (res) => {
        console.log('🚀 ~ file: image-upload.component.ts ', res);
        this.inputModel = res;
        this.inputModelChange.emit(res);
        this.imageurl = environment.imageUrl + res.src;
        if (this.resetFlag) {
          this.imageurl = '';
          this.inputModel = null;
        }
      },
      (err) => {
        console.log('🚀 ~ file: image-upload.component ', err);
      }
    );
  }

  imageDelete() {
    this.imageurl = null;
    this.inputModel = null;
    this.inputModelChange.emit(null);
  }
}
