import { Component } from '@angular/core';
import { AuthService } from 'src/app/utils/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string;
  password: string;
  alertMessage: string;
  successMessage: string;

  constructor(private authService: AuthService) {
    this.username = '';
    this.password = '';
    this.alertMessage = '';
    this.successMessage = '';
  }

  register() {
    if (this.username != '' && this.password != '') {
      this.authService.register(this.username, this.password).subscribe(msg => {
        console.log(msg);
        this.successMessage = msg;
        this.alertMessage = '';
      }, error => {
        this.alertMessage = error.error;
        console.log(error);
      });
    }
  }
}
