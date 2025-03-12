import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Iposts } from '../../../shared/interfaces/posts/iposts';
import { PostsService } from '../../../core/service/Posts/posts.service';
import { UserService } from '../../../core/service/user/user.service';
import { CommentsComponent } from '../../comments/comments.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, CommentsComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);

  myPosts: Iposts[] = [];

  loggedUser: any = {};

  newProfilePhoto!: File;

  profilePreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchMyPosts();
  }

  fetchMyPosts(): void {
    this.postsService.getMyPosts().subscribe({
      next: (res) => {
        console.log('My posts:', res.posts);
        this.myPosts = res.posts;
      },
    
    });
  }

  fetchUserData(): void {
    this.userService.getLoggedUserData().subscribe({
      next: (res) => {
        this.loggedUser = res.user;
      },
    
    });
  }


  handleProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const maxSize = 5 * 1024 * 1024; 
      if (file.size > maxSize) {
        alert('Image size should not exceed 5MB');
        return;
      }

      this.newProfilePhoto = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePreview = e.target.result;
      };
      reader.readAsDataURL(this.newProfilePhoto);
    }
  }

  updateProfilePhoto(): void {
    if (!this.newProfilePhoto) return;

    const formData = new FormData();
    formData.append('photo', this.newProfilePhoto);

    this.userService.updateProfilePhoto(formData).subscribe({
      next: (response) => {
        this.fetchUserData();
        
        this.profilePreview = null;
        this.newProfilePhoto != null;
        
      },
   
    });
  }

  trackByPostId(index: number, post: Iposts) {
    return post._id;
  }

  updateForm!: FormGroup;
  selectedPostId: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  showUpdateModal: boolean = false;

  constructor(private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      body: ['']
    });
  }

  openUpdateModal(post: Iposts): void {
    this.selectedPostId = post._id;
    this.updateForm.patchValue({
      body: post.body
    });
    this.imagePreview = post.image || null;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedPostId = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.updateForm.reset();
  }

  handleUpdateImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result || null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submitUpdate(): void {
    if (!this.selectedPostId) return;

    const formData = new FormData();
    formData.append('body', this.updateForm.get('body')?.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.postsService.updatePost(formData, this.selectedPostId).subscribe({
      next: (res) => {
        console.log('Post updated successfully:', res);
        this.fetchMyPosts();
        this.closeUpdateModal();
      },
  
    });
  }

  deletePost(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postsService.deletePost(postId).subscribe({
        next: (res) => {
          console.log('Post deleted:', res);
          this.myPosts = this.myPosts.filter(post => post._id !== postId);
        },
    
      });
    }
  }

  activeDropdown: string | null = null;

  toggleDropdown(postId: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === postId ? null : postId;
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.activeDropdown = null;
  }
}
