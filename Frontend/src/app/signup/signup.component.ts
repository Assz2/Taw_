import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserHttpService, User } from '../user-http.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public errmessage: string = "";
  public user: User = {
    name: '',
    password: '',
    role: ''
  };

  constructor(private route: Router, private us: UserHttpService) { }

  ngOnInit(): void {
  }

  signup() {
    this.us.register(this.user).subscribe({
      next: (data) => {
        console.log(data);
        this.errmessage = "";
        this.route.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
        this.errmessage = err.error;
      }
    });
  }
}
