import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css'],
  standalone: false
})
export class EmployeeAddComponent {
  employeeForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  employee_photo: string = ''; 

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private location: Location
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  // ✅ Handle image upload and validate size (max 1MB)
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      this.errorMessage = 'Image size should not exceed 1MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.employee_photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ✅ Form submission
  onSubmit(): void {
    this.errorMessage = '';

    if (this.employeeForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isSubmitting = true;

    const formValues = this.employeeForm.value;

    const employee = {
      ...formValues,
      salary: parseFloat(formValues.salary),
      employee_photo: this.employee_photo 
    };

    this.employeeService.addEmployee(
      employee.first_name,
      employee.last_name,
      employee.email,
      employee.gender,
      employee.designation,
      employee.salary,
      employee.date_of_joining,
      employee.department,
      employee.employee_photo 
    ).subscribe({
      next: (res) => {
        console.log('Employee added successfully:', res);
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('Failed to add employee:', err);
        if (err?.message?.includes('already exists')) {
          this.errorMessage = 'An employee with this email already exists.';
        } else {
          this.errorMessage = 'Something went wrong while adding the employee.';
        }
        this.isSubmitting = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
