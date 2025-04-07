import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  standalone: false
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  displayedColumns = ['first_name', 'last_name', 'email', 'department', 'designation', 'actions'];
  searchTerm = '';

  constructor(public router: Router, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (result: any) => {
        this.employees = result?.data?.getAllEmployees || [];
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
        if (err?.message?.includes('not authorized')) {
          this.logout();
        }
      }
    });
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/employees/view', id]);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Failed to delete employee:', err);
        }
      });
    }
  }
  
  search(): void {
    if (this.searchTerm.trim() === '') {
      this.loadEmployees();
      return;
    }

    this.employees = this.employees.filter(emp =>
      emp.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
