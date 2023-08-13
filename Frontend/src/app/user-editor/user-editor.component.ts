import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserHttpService } from '../user-http.service';


@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.css']
})
export class UserEditorComponent implements OnInit {
  public role;

  constructor(private route: Router, private us: UserHttpService) { }

  ngOnInit(): void {
    this.role = this.us.getRole();
  }

  public logout(): void {
    this.us.logout();
  }
}
