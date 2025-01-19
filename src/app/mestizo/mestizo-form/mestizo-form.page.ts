import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { Mestizos } from '../models/mestizo.models';
import { MestizosService } from '../service/mestizos.service';
import { UsersService } from '../service/users.service';
import { Users } from '../models/users.models';

@Component({
  selector: 'app-mestizo-form',
  templateUrl: './mestizo-form.page.html',
  styleUrls: ['./mestizo-form.page.scss'],
})
export class MestizoFormPage implements OnInit {
  userForm!: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  dragging = false;
  isFormCompleted = false; 

  mestizoForm!: FormGroup;
  caracteristicasForm: FormGroup;
  temperamentoForm: FormGroup;
  historiaForm: FormGroup;
  currentForm: number = 1;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private mestizosService: MestizosService,
    private userService: UsersService
  ) {}
  

  ngOnInit() {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      imagen: ['', Validators.required],
    });
    this.isFormCompleted = localStorage.getItem('formCompleted') === 'true';
    if (this.isFormCompleted) {
      this.userForm.disable();
    }
    this.initializeForm();
  }

  initializeForm() {
    this.mestizoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      apodo: ['', Validators.required],
      especie: ['', Validators.required],
      sexo: ['', Validators.required],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      nacionalidad: ['', Validators.required],
    });
    this.caracteristicasForm = this.fb.group({
      tamano: ['', Validators.required],
      peso: ['', Validators.required],
      pelaje: ['', Validators.required],
      color: ['', Validators.required],
      ojos: ['', Validators.required],
    });
    this.temperamentoForm = this.fb.group({
      temperamentos: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(5)],
      ],
    });
  }

  nextForm() {
    if (this.currentForm === 1 && this.mestizoForm.valid) {
      this.currentForm++;
    } else if (this.currentForm === 2 && this.caracteristicasForm.valid) {
      this.currentForm++;
    } else if (this.currentForm === 3 && this.temperamentoForm.valid) {
      this.currentForm++;
    } else {
      this.showToast('Formulario inválido. Por favor, completa todos los campos.');
    }
  }


  previousForm() {
    this.currentForm -= 1;
  }

  onSubmitMestizo() {
    if (this.mestizoForm.valid) {
      console.log('Datos del mestizo:', this.mestizoForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  onSubmitCaracteristicas() {
    if (this.caracteristicasForm.valid) {
      console.log('Datos de características físicas:', this.caracteristicasForm.value);
    }
  }

  onSubmitTemperamento() {
    if (this.temperamentoForm.valid) {
      console.log('Temperamentos seleccionados:', this.temperamentoForm.value);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.historiaForm.patchValue({ imagenes: files });
    }
  }

  validateImageCount(control: any): { [key: string]: boolean } | null {
    const files = control.value;
    if (files && (files.length < 4 || files.length > 6)) {
      return { invalidCount: true };
    }
    return null;
  }

  onSubmitHistoria() {
    if (this.historiaForm.valid) {
      console.log('Formulario válido:', this.historiaForm.value);
    } else {
      this.historiaForm.markAllAsTouched();
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
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
      this.showToast('Solo se pueden subir imágenes (PNG, JPG, GIF).');
      this.userForm.get('imagen')?.setErrors({ invalidFileType: true });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10 MB
      this.showToast('El archivo debe ser menor a 10MB.');
      this.userForm.get('imagen')?.setErrors({ fileTooLarge: true });
      return;
    }

    this.selectedFile = file;
    this.userForm.get('imagen')?.setErrors(null);

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
      });
      await loading.present();

      // Crear el objeto mestizo con los datos del formulario
      const user: Users = {
        nombre: this.userForm.get('nombre')?.value,
        apellido: this.userForm.get('apellido')?.value,
        imagen: '', // La URL de la imagen se asignará después
        createdAt: new Date(),
      };

      this.userService.addUser(user, this.selectedFile!).then(() => {
        this.isSubmitting = false;
        this.userForm.reset();
        this.imagePreview = null;
        this.selectedFile = null;
        loading.dismiss();

        // Marca que el formulario fue completado
        localStorage.setItem('formCompleted', 'true');
        this.isFormCompleted = true; // Cambia el estado a completado
      });
    }
  }
}