import { Component, inject, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../core/service/Comments/comments.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Icomments } from '../../shared/interfaces/icomments';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Iposts } from '../../shared/interfaces/posts/iposts';
import { UserService } from '../../core/service/user/user.service';

@Component({
  selector: 'app-comments',
  standalone: true, 
  imports: [DatePipe, ReactiveFormsModule, CommonModule], 
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {

  private readonly commentsService = inject(CommentsService);
  private readonly userService = inject(UserService);
  
 @Input({required:true}) postId!:string;
  commentsList:Icomments[] = []
  posts:Iposts[]=[]
  currentUserId: string = '';

  commentForm!:FormGroup;

  editCommentForm!:FormGroup;

  editingCommentId: string | null = null;

ngOnInit(): void {

    this.fetchCurrentUser();
    
    this.commentsService.getPostsComments(this.postId).subscribe({
      next:(res)=>{
        console.log(res.comments);
        this.commentsList= res.comments.reverse()
        
      }
    })

    this.commentForm=new FormGroup({
      content:new FormControl(null),
      post:new FormControl(this.postId)
    })
    
    this.editCommentForm = new FormGroup({
      content: new FormControl(null)
    });
}

  fetchCurrentUser(): void {
    this.userService.getLoggedUserData().subscribe({
      next: (res) => {
        this.currentUserId = res.user._id;
      },     
    });
  }

  isCurrentUserComment(comment: Icomments): boolean {
    return comment.commentCreator._id === this.currentUserId;
  }

  addComment():void{
    
  this.commentsService.createComment(this.commentForm.value).subscribe({
  next:(res)=> {
      console.log(res);
      this.commentsList=res.comments.reverse();
      this.commentForm.get('content')?.reset();
  },
})
  }

  startEditing(comment: Icomments): void {
    this.editingCommentId = comment._id;
    this.editCommentForm.get('content')?.setValue(comment.content);
  }

  cancelEditing(): void {
    this.editingCommentId = null;
    this.editCommentForm.get('content')?.reset();
  }

  updateComment(commentId: string): void {
    if (this.editCommentForm.valid) {
      const data = {
        content: this.editCommentForm.get('content')?.value
      };
      
      this.commentsService.updateComment(commentId, data).subscribe({
        next: (res) => {
          console.log('Comment updated successfully', res);

          const index = this.commentsList.findIndex(comment => comment._id === commentId);
          if (index !== -1) {
            this.commentsList[index].content = data.content;
          }
          this.cancelEditing();
        },
      
      });
    }
  }

    deleteComment(commentId: string): void {
      if (confirm('Are you sure you want to delete this comment?')) {

        this.commentsService.deleteComment(commentId).subscribe({
          next: (res) => {
            console.log('Comment deleted successfully', res);
            this.commentsList = this.commentsList.filter(comment => comment._id !== commentId);
          },
       
        });
      }
    }
}
