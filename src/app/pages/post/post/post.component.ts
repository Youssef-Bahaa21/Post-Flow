import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../../core/service/Posts/posts.service';
import { Iposts } from '../../../shared/interfaces/posts/iposts';
import { CommentsComponent } from "../../comments/comments.component";

@Component({
  selector: 'app-post-details',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  imports: [CommentsComponent, CommonModule, DatePipe]
})
export class PostComponent implements OnInit {
  post: Iposts | null = null;
  postId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,private postsService: PostsService) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    if (this.postId) {
      this.fetchPost();
    } else {
      this.errorMessage = 'No post ID provided.';
    }
  }

  fetchPost(): void {
    this.isLoading = true;
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.post) {
          this.post = res.post;
        } else {
          this.errorMessage = 'Post not found.';
        }
      },
 
    });
  }
}
