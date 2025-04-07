import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

//For refetching employees after deleted
const GET_ALL_EMPLOYEES = gql`
  query {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      department
      designation
    }
  }
`;
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getEmployees() {
    return this.apollo.watchQuery({
      query: gql`
        query {
          getAllEmployees {
            _id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
          }
        }
      `
    }).valueChanges;
  }

  getEmployeeById(id: string) {
    return this.apollo.watchQuery({
      query: gql`
        query GetEmployee($eid: ID!) {
          searchEmployeeById(eid: $eid) {
            _id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo       # <-- include this
          }
        }
      `,
      variables: { eid: id }
    }).valueChanges;
  }
  
  

  addEmployee(
    first_name: string,
    last_name: string,
    email: string,
    gender: string,
    designation: string,
    salary: number,
    date_of_joining: string,
    department: string,
    employee_photo?: string
  ) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddEmployee(
          $first_name: String!,
          $last_name: String!,
          $email: String!,
          $gender: String!,
          $designation: String!,
          $salary: Float!,
          $date_of_joining: String!,
          $department: String!,
          $employee_photo: String
        ) {
          addEmployee(
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            salary: $salary,
            date_of_joining: $date_of_joining,
            department: $department,
            employee_photo: $employee_photo
          ) {
            _id
          }
        }
      `,
      variables: {
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining,
        department,
        employee_photo
      },
      refetchQueries: [
        {
          query: gql`
            query {
              getAllEmployees {
                _id
                first_name
                last_name
                email
                department
                designation
                employee_photo
              }
            }
          `
        }
      ]
    });
  }
  
  

  updateEmployee(id: string, employee: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateEmployee(
          $eid: ID!,
          $first_name: String!,
          $last_name: String!,
          $email: String!,
          $gender: String!,
          $designation: String!,
          $salary: Float!,
          $date_of_joining: String!,
          $department: String!
        ) {
          updateEmployee(
            eid: $eid,
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            salary: $salary,
            date_of_joining: $date_of_joining,
            department: $department
          ) {
            _id
          }
        }
      `,
      variables: {
        eid: id,
        ...employee
      },
      refetchQueries: [
        {
          query: gql`
            query {
              getAllEmployees {
                _id
                first_name
                last_name
                email
                department
                designation
              }
            }
          `
        }
      ]
    });
  }
  
  deleteEmployee(id: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteEmployee($eid: ID!) {
          deleteEmployee(eid: $eid)
        }
      `,
      variables: { eid: id },
      refetchQueries: [
        {
          query: GET_ALL_EMPLOYEES
        }
      ],
      awaitRefetchQueries: true 
    });
  }
  
  
  
}
