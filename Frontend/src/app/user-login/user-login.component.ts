import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserHttpService } from '../user-http.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit{
  
  public errMessage = undefined;
  constructor( private router: Router, private us: UserHttpService  ) { }
  
    
  ngOnInit(){
  }

  login(name: string, password: string, remember: boolean){
    this.us.login(name, password, remember).subscribe({
      next: (data) => {
        console.log('Login granted: ' + JSON.stringify(data));
        console.log('User service token: ' + this.us.getToken());
        this.errMessage = undefined;
        this.router.navigate(['/tables']);
      },
      error: (err) => {
        console.log('Login failed: ' + JSON.stringify(err));
        this.errMessage = err.error.message;
      }
    });
  }
  
}
