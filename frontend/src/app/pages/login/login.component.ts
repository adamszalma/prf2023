import { Component } from '@angular/core';
import { AuthService } from 'src/app/utils/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  alertMessage: string;

  constructor(private authService: AuthService) {
    this.username = '';
    this.password = '';
    this.alertMessage = '';
  }

  login() {
    if (this.username != '' && this.password != '') {
      this.authService.login(this.username, this.password).subscribe(msg => {
        console.log(msg);
        localStorage.setItem('user', this.username);
        this.alertMessage = '';
      }, error => {
        this.alertMessage = error.error;
        console.log(error);
      });
    }
  }
}
