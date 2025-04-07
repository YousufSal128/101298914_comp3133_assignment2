import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
  standalone: false
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  id: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.employeeService.getEmployeeById(this.id).subscribe((res: any) => {
      const emp = res.data.searchEmployeeById;
      this.employeeForm.patchValue(emp);
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    const updatedEmployee = {
      ...this.employeeForm.value,
      salary: parseFloat(this.employeeForm.value.salary)
    };

    this.employeeService.updateEmployee(this.id, updatedEmployee).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('Failed to update employee:', err);
      }
    });

    
  }
  goBack() {
    this.location.back();
  }
}
