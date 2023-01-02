import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';
import { ToastService } from 'src/app/core/general/service/toast.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  @Input() userData: any;
  profileForm: FormGroup;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private toast: ToastService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    console.log('userData ', this.userData);
    if (this.userData) {
      this.profileForm.patchValue(this.userData);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  update() {
    console.log(this.profileForm.value);
    this.dataService
      .postMethod(HttpApi.userUpdate, { name: this.profileForm.value.name })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.modalController.dismiss();
          this.toast.presentToast('profile name updated successfully');
        },
        error: (error) => {
          console.log(error);
          this.toast.presentToast(error?.message);
        },
      });
  }
}
