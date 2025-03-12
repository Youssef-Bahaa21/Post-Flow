import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PostsService } from '../../core/service/Posts/posts.service';
import { UserService } from '../../core/service/user/user.service';

import { CommentsComponent } from '../comments/comments.component';
import { Iposts } from '../../shared/interfaces/posts/iposts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timline',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CommentsComponent],
  templateUrl: './timline.component.html',
  styleUrls: ['./timline.component.css']
})
export class TimlineComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);
  private router = inject(Router);

  content: string = '';
  savedFile!: File;
  imagePreview: string | ArrayBuffer | null = null;

  postsList: Iposts[] = [];
  filteredPostsList: Iposts[] = []; 
  loggedUser: any = {};
  usersList: any[] = [];
  selectedUserId: string | null = null;

  isModalOpen = false;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchPosts();
  }

  fetchUserData(): void {
    this.userService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log('Logged user data:', res);
        this.loggedUser = res.user;
      },
    });
  }

  fetchPosts(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    console.log('Fetching all posts');
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        if (res && Array.isArray(res.posts)) {
          this.postsList = res.posts;
          this.filteredPostsList = this.postsList;
          this.extractUsers();
          console.log(`Loaded ${this.postsList.length} posts`);
        } else {
          console.error('Invalid posts data format:', res);
        }
        this.isLoading = false;
      },
    });
  }

  extractUsers(): void {
    const uniqueUsers = new Map<string, any>();
    this.postsList.forEach(post => {
      if (post.user && post.user._id) {
        uniqueUsers.set(post.user._id, post.user);
      }
    });
    this.usersList = Array.from(uniqueUsers.values());
  }

  filterPosts(userId: string): void {
    this.selectedUserId = userId;
    this.filteredPostsList = this.postsList.filter(post => post.user && post.user._id === userId);
  }

  clearFilter(): void {
    this.selectedUserId = null;
    this.filteredPostsList = this.postsList;
  }

  viewPost(post: Iposts): void {
    this.postsService.getSinglePost(post._id).subscribe({
      next: (res) => {
        console.log('Single post data:', res);
        this.router.navigate(['/post', post._id]);
      },
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  changeImage(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.savedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      };
      reader.readAsDataURL(this.savedFile);
    }
  }

  createPost(): void {
    const formData = new FormData();
    formData.append('body', this.content);
    if (this.savedFile) {
      formData.append('image', this.savedFile);
    }
    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        console.log('Post created', res);
        if (res.message === 'success') {
          this.closeModal();
          this.content = '';
          this.imagePreview = null;
          this.savedFile = null as any;
          this.fetchPosts();
        }
      },
    });
  }
}
