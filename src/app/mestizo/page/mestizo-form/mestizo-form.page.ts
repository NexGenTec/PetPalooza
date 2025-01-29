import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { MestizosService } from '../../service/mestizos.service';
import { Mestizos, Users } from '../../models/users.models';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSessionService } from '../../service/user-session.service';
import { TemperamentosMestizos } from '../../models/TemperamentosMestizos.models';

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
  TemperamentosMestizos = TemperamentosMestizos;
  historiaForm: FormGroup;
  currentForm: number = 1;
  newTemperamento: string = '';
  temperamentos: FormArray;
  newTemperamentoControl: FormControl;
  selectedImages: string[] = [];


  especies: string[] = [
    'Canino', 'Felino', 'Conejo', 'Cerdo', 'Caballo', 'Pájaro', 'Reptil', 'Roedor', 'Pez',
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

  userData: Users
  mestizoId: string | null = null;
  mestizoName: string = '';
  constructor(
    private _formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private mestizosService: MestizosService,
    private router: Router,
    private alertController: AlertController,
    private userService: UserSessionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.initializeUserForm();
    this.checkUserSession();
    
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      this.userData = JSON.parse(savedUser);
      this.isFormCompleted = true;
    }
    
    this.mestizoId = this.route.snapshot.paramMap.get('id');
    console.log('Mestizo ID from URL:', this.mestizoId);
    if (this.mestizoId) {
      this.loadMestizoData(this.mestizoId);
    }
  }  

  initializeForm() {
    this.mestizoName = ''; 
    this.mestizoId = null;
    this.mestizoForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      apodo: ['', Validators.required],
      especie: ['', Validators.required],
      sexo: ['', Validators.required],
      edad: [, Validators.required],
      unidadEdad: ['', Validators.required], 
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

  async loadMestizoData(id: string) {
    console.log('Loading mestizo data for ID:', id);
    try {
      this.mestizosService.getMestizoById(id).subscribe({
        next: (mestizo) => {
            this.mestizoName = mestizo.nombre;
            this.mestizoId = id;
          console.log('Mestizo data loaded:', mestizo);
          
          if (mestizo) {
            // Patch form with the data
            this.mestizoForm.patchValue({
              nombre: mestizo.nombre,
              apellido: mestizo.apellido,
              apodo: mestizo.apodo,
              especie: mestizo.especie,
              sexo: mestizo.sexo,
              edad: mestizo.edad,
              unidadEdad: mestizo.unidadEdad,
              nacionalidad: mestizo.nacionalidad
            });

            this.caracteristicasForm.patchValue({
              tamano: mestizo.tamano,
              peso: mestizo.peso,
              pelaje: mestizo.pelaje,
              color: mestizo.color,
              ojos: mestizo.ojos
            });
            this.temperamentos.clear();
            mestizo.temperamentos.forEach((temperamento) => {
              this.temperamentos.push(this._formBuilder.control(temperamento));
            });
            this.historiaForm.patchValue({
              historia: mestizo.historia,
            });
            this.selectedImages = [...(mestizo.imagenMascota || [])];
            const imagenesFormArray = this.historiaForm.get('imagenes') as FormArray;
            imagenesFormArray.clear();

            this.selectedImages.forEach((img: string) => {
              imagenesFormArray.push(new FormControl(img));
            });
          } else {
            console.log('No data found for the given ID');
          }
        },
        error: (error) => {
          console.error('Error loading mestizo data:', error);
        }
      });
    } catch (error) {
      console.error('Error in loadMestizoData method:', error);
    }
  }
  

  onImageSelect(event: any) {
    const files: FileList = event.target.files;
    if (files.length === 0) {
      return;
    }
  
    const totalSelectedImages = this.selectedImages.length;
    if (totalSelectedImages + files.length > 6) {
      this.showToast('No puedes seleccionar más de 6 imágenes en total. El límite es 6.', 'danger');
      return;
    }
  
    const imagenesFormArray = this.historiaForm.get('imagenes') as FormArray;
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        this.showToast('Formato de archivo no permitido. Solo se aceptan imágenes PNG, JPG o GIF.', 'danger');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.showToast('El archivo excede el tamaño máximo de 10MB. Por favor selecciona un archivo más pequeño.', 'danger');
        continue;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        this.selectedImages.push(imageUrl);
        imagenesFormArray.push(new FormControl(imageUrl));
  
        // Verificar que el campo de imágenes esté validado correctamente
        if (imagenesFormArray.length >= 4 && imagenesFormArray.length <= 6) {
          this.historiaForm.get('imagenes').setErrors(null);  // Si tiene entre 4 y 6 imágenes, no hay error
        } else {
          this.historiaForm.get('imagenes').setErrors({ 'minlength': true });
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }  
  

  removeImages(index: number) {
    this.selectedImages.splice(index, 1);
  
    const imagenesFormArray = this.historiaForm.get('imagenes') as FormArray;
    imagenesFormArray.removeAt(index);
  }

  async submitForms() {
    const userSession = JSON.parse(sessionStorage.getItem('user') || '{}');

    if (this.mestizoForm.valid && this.caracteristicasForm.valid && this.temperamentoForm.valid && this.historiaForm.valid) {
      if (this.selectedImages.length < 4 || this.selectedImages.length > 6) {
        this.showToast('Debes subir entre 4 y 6 imágenes', 'danger');
        return;
      }

      this.isSubmitting = true;

      const loading = await this.loadingController.create({
        message: 'Registrando mascota...',
        mode: 'ios',
      });
      await loading.present();

      const mascotaData = {
        ...this.mestizoForm.value,
        ...this.caracteristicasForm.value,
        ...this.temperamentoForm.value,
        ...this.historiaForm.value,
      };

      try {
        if (this.mestizoId) {
          if (this.selectedImages.length > 0) {
            // Subir nuevas imágenes
            const imageUrls = await this.mestizosService.uploadImages(this.selectedImages, mascotaData);
            mascotaData.imagenMascota = imageUrls; // Establecer solo las imágenes
          }

          // Actualizar los campos
          await this.mestizosService.updateMestizoWithoutImages({
            id: this.mestizoId,
            ...mascotaData,
          });

          this.showToast('Mestizo actualizado con éxito', 'success');
          this.router.navigateByUrl('/tabs/mestizo');
          this.resetForms();
        } else {
          if (this.selectedImages.length > 0) {
            const imageUrls = await this.mestizosService.uploadImages(this.selectedImages, mascotaData);
            mascotaData.imagenMascota = imageUrls;

            await this.mestizosService.addMestizos(userSession.id, mascotaData, imageUrls);
            this.showToast('Mascota registrada con éxito', 'success');
            this.router.navigateByUrl('/tabs/mestizo');
            this.resetForms();
          } else {
            this.showToast('Debes seleccionar al menos una imagen', 'danger');
          }
        }
      } catch (error) {
        console.error('Error al registrar o actualizar la mascota:', error);
        this.showToast('Error al procesar la mascota', 'danger');
      } finally {
        this.isSubmitting = false;
        loading.dismiss();
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
      this.showToast('Aún no tiene un usuario registrado.', 'danger');
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
    if (!this.userForm.valid || !this.selectedFile) {
      this.showToast('Debe completar el formulario de registro de usuario.', 'danger');
      return;
    }
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
        this.userService.setUser(userData); 
        this.userData = userData; 
        this.isFormCompleted = true;
        this.showToast('Usuario registrado con éxito', 'success');
        this.resetUserForm();
        this.showStorageAlert();
      })
      .catch(() => {
        this.showToast('Error al registrar usuario', 'danger');
      })
      .finally(() => {
        this.isSubmitting = false;
        loading.dismiss();
      });
  }  

  async showStorageAlert() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Tu información ha sido guardada en la memoria de tu dispositivo. Evita borrar la memoria para no perder tus datos.',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel'
        }
      ],
      mode: 'ios'
    });
  
    await alert.present();
  }  

  resetUserForm() {
    this.userForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
    this.userForm.enable();
  }
  
}