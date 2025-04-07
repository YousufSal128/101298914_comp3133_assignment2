import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css'],
  standalone: false
})
export class EmployeeViewComponent implements OnInit {
  employee: any;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private location: Location
  ) {}
  
  goBack() {
    this.location.back();
  }
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log('Viewing employee ID:', id); 
    this.employeeService.getEmployeeById(id).subscribe((res: any) => {
      this.employee = res.data.searchEmployeeById;
    });
  }
  
}
