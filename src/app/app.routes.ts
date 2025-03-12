import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { TimlineComponent } from './pages/timline/timline.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { authGuard } from './core/guards/guards/auth.guard';
import { guestGuard } from './core/guards/guards/guest.guard';
import { PostComponent } from './pages/post/post/post.component';

export const routes: Routes = [
    {path:'',redirectTo:'timeline',pathMatch:'full'},
    {path:"",component:AuthLayoutComponent,children:[
        {path:'login',component:LoginComponent,title:'Login', canActivate: [guestGuard]},
        {path:'signup',component:SignupComponent,title:'Register', canActivate: [guestGuard]},
        {path:'resetpassword',component:ForgetPasswordComponent,title:'ReserPassword', canActivate: [guestGuard]},


    ]},
    {path:"",component:BlankLayoutComponent,children:[
        {path:'timeline',component:TimlineComponent,title:'TimeLine', canActivate: [authGuard]},
        {path:'profile',component:ProfileComponent,title:'Profile', canActivate: [authGuard]},
        { path: 'post/:id', component: PostComponent, title: 'Post', canActivate: [authGuard] },

        
        {path:'**',component:NotfoundComponent,title:'NotFound'}
    ]},
];
