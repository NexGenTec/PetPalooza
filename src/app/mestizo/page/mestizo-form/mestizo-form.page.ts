import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController, ModalController } from '@ionic/angular';
import { MestizosService } from '../../service/mestizos.service';
import { Users } from '../../models/users.models';
import { Router } from '@angular/router';

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


  especies: string[] = [
    'Perro', 'Gato', 'Conejo', 'Cerdo', 'Caballo', 'Pájaro', 'Reptil', 'Roedor', 'Pez',
    'Tortuga', 'Loro', 'Pececito', 'Hámster', 'Erizo'
  ];

  tamanos: string[] = [
    'Pequeño', 'Mediano', 'Grande', 'Enorme'
  ];

  pelajes: string[] = [
    'Corto',
    'Largo',
    'Semi-largo',
    'Rizado',
    'Lacio',
    'Doble capa',
    'Ondulado',
    'Suave',
    'Espeso',
    'Desgreñado'
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private mestizosService: MestizosService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.initializeUserForm();
    this.checkUserSession();
  }  

  initializeForm() {
    this.mestizoForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      apodo: ['', Validators.required],
      especie: ['', Validators.required],
      sexo: ['', Validators.required],
      edad: [, Validators.required],
      nacionalidad: ['', Validators.required]
    });
    this.caracteristicasForm = this._formBuilder.group({
      tamano: ['', Validators.required],
      peso: ['', Validators.required],
      pelaje: ['', Validators.required],
      color: ['', Validators.required],
      ojos: ['', Validators.required]
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
    const userSession = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.mestizoForm.valid && this.caracteristicasForm.valid && this.temperamentoForm.valid && this.historiaForm.valid) {
      this.isSubmitting = true;
  
      const mascotaData = {
        ...this.mestizoForm.value,
        ...this.caracteristicasForm.value,
        ...this.temperamentoForm.value,
        ...this.historiaForm.value
      };
  
      if (this.selectedImages.length > 0) {
        this.mestizosService.uploadImages(this.selectedImages, mascotaData).then((imageUrls) => {
          mascotaData.imagenes = imageUrls;
          this.mestizosService.addMestizos(userSession.id, mascotaData, imageUrls)
            .then(() => {
              this.showToast('Mascota registrada con éxito', 'success');
              this.router.navigateByUrl('/mestizo');
              this.resetForms();
            })
            .catch((error) => {
              console.error('Error al registrar la mascota:', error);
            })
            .finally(() => {
              this.isSubmitting = false;
            });
        }).catch((error) => {
          console.error('Error al subir las imágenes:', error);
        });
      } else {
        
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
    if (!this.isFormCompleted) {
      return;
    }
    const forms = [this.mestizoForm, this.caracteristicasForm, this.temperamentoForm, this.historiaForm];
  
    if (this.currentForm < forms.length && forms[this.currentForm - 1]?.valid) {
      this.currentForm++;
    } else {
      this.showToast('Completa el formulario actual antes de continuar.', 'danger');
    }
  }  
  
  prevForm() {
    if (this.currentForm > 1) {
      this.currentForm--;
    }
  }  

  private checkUserSession() {
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      this.isFormCompleted = true;
    } else {
      this.isFormCompleted = false;
    }
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
  
      this.mestizosService.addUser(user, this.selectedFile!)
        .then((userData) => {
          sessionStorage.setItem('user', JSON.stringify(userData));
          this.isFormCompleted = true;
          this.showToast('Usuario registrado con éxito', 'success');
          this.resetUserForm();
        })
        .catch(() => {
          this.showToast('Error al registrar usuario', 'danger');
        })
        .finally(() => {
          this.isSubmitting = false;
          loading.dismiss();
        });
    }
  }  

  resetUserForm() {
    this.userForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
    this.userForm.enable();
  }
  
}