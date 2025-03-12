import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/service/user/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth/auth.service';
@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly userService=inject(UserService)
  private readonly router=inject(Router)
  private readonly authService=inject(AuthService)

  loginDetails:FormGroup=new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', 
    [
    Validators.required,
    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    ]
  )
  })

  login():void{
    this.userService.signIn(this.loginDetails.value).subscribe({
      next:(res)=>{
        console.log(res);  
        // Save token using AuthService
        this.authService.setToken(res.token);
        // Navigate to timeline after setting token
        this.router.navigate(['/timeline']);
      }
    })
  }
}
