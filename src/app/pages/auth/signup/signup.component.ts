import { UserService } from './../../../core/service/user/user.service';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [RouterLink,ReactiveFormsModule,],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
, standalone:true
})
export class SignupComponent {
  private readonly userService=inject(UserService)
    private readonly router=inject(Router)
  
  formdetails: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required)
  });


  signup():void{
    this.userService.signup(this.formdetails.value).subscribe({
      next:(res)=>{
        console.log(res);
        this.router.navigate(['/login'])

        
      }
    })
  }
}
