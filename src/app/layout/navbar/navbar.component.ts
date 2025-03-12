import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener, OnInit, Input } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { UserService } from '../../core/service/user/user.service';
import { AuthService } from '../../core/service/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() isLogin: boolean = false;
  isDropdownOpen = false;
  loggedUser: any = {};
  isProfilePage: boolean = false; // Track if user is in profile page

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('triggerButton') triggerButton!: ElementRef;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLogin = this.authService.isLoggedIn();

    if (this.isLogin) {
      this.fetchLoggedUserData();
    }

    // Detect route changes and update the profile page check
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isProfilePage = this.router.url.includes('/profile');
      }
    });
  }

  fetchLoggedUserData(): void {
    this.userService.getLoggedUserData().subscribe({
      next: (res) => {
        this.loggedUser = res.user;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        if (err.status === 401) {
          this.authService.logout();
          this.isLogin = false;
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  signOut() {
    this.authService.logout();
    this.isLogin = false;
    this.closeDropdown();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      !this.dropdownMenu?.nativeElement.contains(event.target) &&
      !this.triggerButton?.nativeElement.contains(event.target)
    ) {
      this.isDropdownOpen = false;
    }
  }
}
