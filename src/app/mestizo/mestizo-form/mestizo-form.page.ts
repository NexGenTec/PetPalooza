import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController, ModalController } from '@ionic/angular';
import { MestizosService } from '../service/mestizos.service';
import { UsersService } from '../service/users.service';
import { Users } from '../models/users.models';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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
  newTemperamento: string = '';
  temperamentos: FormArray;
  newTemperamentoControl: FormControl;
  selectedImages: string[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private mestizosService: MestizosService,
    private userService: UsersService,
    private storage: AngularFireStorage,
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.initializeUserForm();
    this.checkUserSession();
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
    this.caracteristicasForm = this._formBuilder.group({
      tamano: ['Mediano', Validators.required],
      peso: ['15 kg', Validators.required],
      pelaje: ['Corto', Validators.required],
      color: ['Marrón', Validators.required],
      ojos: ['Cafés', Validators.required]
    });
    this.newTemperamentoControl = this._formBuilder.control('', Validators.required);
    this.temperamentos = this._formBuilder.array([], [Validators.minLength(3), Validators.maxLength(5)]);

    this.temperamentoForm = this._formBuilder.group({
      temperamentos: this.temperamentos,
    });
    this.historiaForm = this._formBuilder.group({
      historia: ['', Validators.required],
      imagenes: [, [Validators.required]],
    });
  }

  onImageSelect(event: any) {
    const files: FileList = event.target.files;
  
    if (files.length < 4 || files.length > 6) {
      this.showToast('Debes subir entre 4 y 6 imágenes.', 'danger');
      return;
    }
  
    this.selectedImages = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        this.showToast('Formato de archivo no permitido. Solo se aceptan PNG, JPG, y GIF.', 'danger');
        continue;
      }
  
      if (file.size > 10 * 1024 * 1024) {
        this.showToast('El archivo excede el tamaño máximo de 10MB.', 'danger');
        continue;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  
    event.target.value = '';
  } 

  removeImages(index: number) {
    this.selectedImages.splice(index, 1);
  }

  submitForms() {
    if (this.mestizoForm.valid && this.caracteristicasForm.valid && this.temperamentoForm.valid && this.historiaForm.valid) {
      this.isSubmitting = true;
  
      const mascotaData = {
        ...this.mestizoForm.value,
        ...this.caracteristicasForm.value,
        ...this.temperamentoForm.value,
        ...this.historiaForm.value
      };
  
      if (this.selectedImages.length > 0) {
        this.mestizosService.uploadImages(this.selectedImages).then((imageUrls) => {
          mascotaData.imagenes = imageUrls;
          this.mestizosService.addMestizos(mascotaData, imageUrls)
            .then(() => {
              console.log('Mascota registrada con éxito');
              sessionStorage.setItem('mascotaData', JSON.stringify(mascotaData));
              this.resetForms();
            })
            .catch((error) => {
              console.error('Error al registrar la mascota:', error);
              alert('Hubo un problema al registrar la mascota.');
            })
            .finally(() => {
              this.isSubmitting = false;
            });
        }).catch((error) => {
          console.error('Error al subir las imágenes:', error);
          alert('Hubo un problema al subir las imágenes.');
        });
      } else {
        alert('Debes seleccionar imágenes para subir');
      }
    } else {
      this.showToast('Completa todos los campos correctamente antes de enviar', 'danger');
    }
  }
  
  resetForms() {
    this.mestizoForm.reset();
    this.caracteristicasForm.reset();
    this.temperamentoForm.reset();
    this.historiaForm.reset();
    this.currentForm = 1;
    this.selectedImages = [];
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

  addTemperamento() {
    if (this.newTemperamentoControl.value.trim() && this.temperamentos.controls.length < 5) {
      this.temperamentos.push(this._formBuilder.control(this.newTemperamentoControl.value.trim()));
      this.newTemperamentoControl.setValue('');
      this.temperamentoForm.updateValueAndValidity();
    }
  }

  
  removeTemperamento(index: number) {
    this.temperamentos.removeAt(index);
    this.temperamentoForm.updateValueAndValidity();
  }

  validateTemperamento() {
    if (this.newTemperamentoControl.value.trim()) {
      this.temperamentoForm.get('temperamentos')?.setValidators([Validators.minLength(3), Validators.maxLength(5)]);
      this.temperamentoForm.get('temperamentos')?.updateValueAndValidity();
    }
  }  

  nextForm() {
    const forms = [
      this.mestizoForm,
      this.caracteristicasForm,
      this.temperamentoForm,
      this.historiaForm
    ];
  
    if (this.currentForm < forms.length && forms[this.currentForm - 1]?.valid) {
      this.currentForm++;
    }
  }
  
  prevForm() {
    if (this.currentForm > 1) {
      this.currentForm--;
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