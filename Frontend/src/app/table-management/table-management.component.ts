import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TableHttpService, Table } from '../table-http.service';

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.css']
})
export class TableManagementComponent implements OnInit{
  public errmessage: string = "";
  public table: Table = {
    tableId: 0,
    seats: 0,
    free: true
  };

  constructor(private router: Router, private ts: TableHttpService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  isValidId(){
    return this.table.tableId > 0; 
  }

  isValidSeats(){
    return this.table.seats > 0;
  }

  goToTables(){
    this.router.navigate(['/tables']);
  }

  addTable(){
    this.ts.postTable(this.table).subscribe({
      next: (data) => {
        console.log("Posted table: " + JSON.stringify(data));
        this.errmessage = "";
        this.goToTables();
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.errmessage = err.error.errormessage;
        this.cdr.detectChanges();
      }
    });
  }

}
