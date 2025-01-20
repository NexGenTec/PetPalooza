import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController, ModalController } from '@ionic/angular';
import { MestizosService } from '../service/mestizos.service';
import { UsersService } from '../service/users.service';
import { Users } from '../models/users.models';

@Component({
  selector: 'app-mestizo-form',
  templateUrl: './mestizo-form.page.html',
  styleUrls: ['./mestizo-form.page.scss'],
})
export class MestizoFormPage implements OnInit {
  userForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  dragging = false;
  isFormCompleted = false; 

  mestizoForm: FormGroup;
  caracteristicasForm: FormGroup;
  temperamentoForm: FormGroup;
  historiaForm: FormGroup;
  currentForm: number = 1;
  temperamentos: FormArray;

  constructor(
    private _formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private mestizosService: MestizosService,
    private userService: UsersService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.initializeUserForm();
    this.checkUserSession();
  }  

  async showToast(message: string, type: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      mode: 'ios',
      color: type === 'success' ? 'success' : 'danger',
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            toast.dismiss();
          },
        },
      ],
    });
    toast.present();
  }


  initializeForm() {
    this.mestizoForm = this._formBuilder.group({
      nombre: ['Max', Validators.required],
      apellido: ['Doe', Validators.required],
      apodo: ['Fido', Validators.required],
      especie: ['Perro', Validators.required],
      sexo: ['Macho', Validators.required],
      edad: [3, Validators.required],
      nacionalidad: ['Chilena', Validators.required]
    });    
  }

  submitForm() {
    console.log('Intentando registrar mascota...');
    
    if (this.mestizoForm.valid) {
      const mascotaData = this.mestizoForm.value;
      console.log('Formulario válido:', mascotaData);
  
      this.mestizosService.addMestizos(mascotaData)
        .then((docRef) => {
          console.log('Mascota registrada con ID:', docRef.id);
          sessionStorage.setItem('mascotaData', JSON.stringify(mascotaData));
          alert('¡Mascota registrada con éxito!');
          this.mestizoForm.reset();
        })
        .catch((error) => {
          console.error('Error al registrar la mascota:', error);
        });
    } else {
      console.log('Formulario inválido:', this.mestizoForm.errors);
      alert('Por favor, completa todos los campos correctamente.');
    }
  }

  private checkUserSession() {
    this.isFormCompleted = !!sessionStorage.getItem('user');
  }

  initializeUserForm() {
    this.userForm = this._formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      imagen: [null, [Validators.required]],
    });
  }
  
  disableForm() {
    this.userForm.controls['nombre'].disable();
    this.userForm.controls['apellido'].disable();
    this.userForm.controls['imagen'].disable();
  }
  
  enableForm() {
    this.userForm.controls['nombre'].enable();
    this.userForm.controls['apellido'].enable();
    this.userForm.controls['imagen'].enable();
  }  

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.handleFile(fileInput.files[0]);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.dragging = false;
  }

  handleFile(file: File) {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

    if (!validTypes.includes(file.type)) {
      this.userForm.get('imagen')?.setErrors({ invalidFileType: true });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10 MB
      this.userForm.get('imagen')?.setErrors({ fileTooLarge: true });
      return;
    }
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.userForm.get('imagen')?.reset();
  }


  async onSubmit() {
    if (this.userForm.valid && this.selectedFile) {
      this.isSubmitting = true;
      this.userForm.disable();
  
      const loading = await this.loadingController.create({
        message: 'Guardando información...',
        mode: 'ios',
      });
      await loading.present();
  
      const user: Users = {
        nombre: this.userForm.get('nombre')?.value,
        apellido: this.userForm.get('apellido')?.value,
        imagen: '',
        createdAt: new Date(),
      };
      
      this.userService.addUser(user, this.selectedFile!).then((userData) => {
        this.isSubmitting = false;
        this.userForm.reset();
        this.imagePreview = null;
        this.selectedFile = null;
        loading.dismiss();
  
        // Guardamos la información del usuario con la URL de la imagen en sessionStorage
        sessionStorage.setItem('user', JSON.stringify(userData));
  
        // Marcamos que el formulario fue completado
        sessionStorage.setItem('formCompleted', 'true');
        this.isFormCompleted = true;
  
        // Mostrar mensaje de éxito
        this.showToast('Formulario enviado correctamente', 'success');
      }).catch(() => {
        this.isSubmitting = false;
        loading.dismiss();
        this.showToast('Hubo un error al guardar la información', 'danger');
      });
    }
  }
  
  // nextForm() {
  //   if (this.currentForm === 1 && this.mestizoForm.valid) {
  //     localStorage.setItem('mestizoFormData', JSON.stringify(this.mestizoForm.value));
  //     this.currentForm++;
  //   } else if (this.currentForm === 2 && this.caracteristicasForm.valid) {
  //     localStorage.setItem('caracteristicasFormData', JSON.stringify(this.caracteristicasForm.value));
  //     this.currentForm++;
  //   } else {
  //     console.log();
  //   }
  // }

  // previousForm() {
  //   if (this.currentForm > 1) {
  //     this.currentForm--;
  //   }
  // }


  // onSubmitCaracteristicas() {
  //   if (this.caracteristicasForm.valid) {
  //     console.log('Datos de características físicas:', this.caracteristicasForm.value);
  //   }
  // }

  // onSubmitTemperamento() {
  //   if (this.temperamentoForm.valid) {
  //     console.log('Temperamentos seleccionados:', this.temperamentoForm.value);
  //   }
  // }

  // validateImageCount(control: FormArray): { [key: string]: boolean } | null {
  //   const images = control.value || [];
  //   if (images.length < 4 || images.length > 6) {
  //     return { invalidImageCount: true };
  //   }
  //   return null;
  // }

  // addTemperamento() {
  //   const newTemperamento = this.temperamentoForm.get('newTemperamento')?.value;
  //   if (newTemperamento) {
  //     this.temperamentos.push(this.fb.control(newTemperamento));
  //     this.temperamentoForm.get('newTemperamento')?.reset();
  //   }
  // }

  // onSubmitHistoria(){

  // }

  // removeTemperamento(index: number) {
  //   this.temperamentos.removeAt(index);
  // }

  // minTemperamentosValidator(control: FormArray): { [key: string]: boolean } | null {
  //   if (control.length < 1) {
  //     return { minTemperamentos: true };
  //   }
  //   return null;
  // }

  // maxTemperamentosValidator(control: FormArray): { [key: string]: boolean } | null {
  //   if (control.length > 5) {
  //     return { maxTemperamentos: true };
  //   }
  //   return null;
  // }

  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input?.files && input.files.length > 0) {
  //     this.selectedFile = input.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imagePreview = reader.result as string;
  //     };
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

}