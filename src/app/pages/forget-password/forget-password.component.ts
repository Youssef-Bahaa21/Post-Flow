import { Component, inject } from '@angular/core';
import { UserService } from '../../core/service/user/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
 private readonly  userService=inject(UserService);


 formDetails :FormGroup=new FormGroup({
  password : new FormControl ('',Validators.required),
  newPassword:new FormControl('',Validators.required)
 })

 resetPass(){
  this.userService.changePass(this.formDetails.value).subscribe({
    next:(res) =>{
        console.log(res);
    },
  }
  )
 }
}
