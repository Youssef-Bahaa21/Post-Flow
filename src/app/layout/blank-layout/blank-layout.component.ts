import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css'
})
export class BlankLayoutComponent {

}
