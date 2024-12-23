import {Component, inject, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CommentService} from '../../core/services/comment.service';
import {Comment} from '../../core/interfaces/comment.interface';
import {UserService} from '../../core/services/user.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comments-section mt-6">
      <h3 class="text-lg font-medium text-gray-900 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500"
             viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clip-rule="evenodd" />
        </svg>
        Commentaires
      </h3>

      <div class="mt-3 space-y-4">
        <!-- Liste des commentaires -->
        @for (comment of comments(); track comment.id) {
          <div class="comment bg-gray-50 p-3 rounded-lg">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {{comment.user?.firstName?.charAt(0) || 'U'}}
                </div>
                <div>
                  <div class="font-medium">{{comment.user?.firstName}} {{comment.user?.lastName}}</div>
                  <div class="text-xs text-gray-500">
                    {{comment.createdAt | date:'medium'}}
                  </div>
                </div>
              </div>

              @if (canDeleteComment(comment)) {
                <button
                  class="text-gray-400 hover:text-red-500"
                  (click)="deleteComment(comment.id!)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                       viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd" />
                  </svg>
                </button>
              }
            </div>
            <div class="mt-2 text-sm text-gray-700">
              {{comment.content}}
            </div>
          </div>
        }

        <!-- Formulaire nouveau commentaire -->
        <div class="new-comment mt-4">
          <textarea
            [(ngModel)]="newCommentContent"
            (keydown)="handleKeyDown($event)"
            placeholder="Écrire un commentaire... (Ctrl+Enter pour envoyer)"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          ></textarea>
          <div class="mt-2 flex justify-end">
            <button
              (click)="addComment()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              [disabled]="!newCommentContent.trim()"
            >
              Commenter
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CommentSectionComponent {
  @Input() taskId!: number;
  comments = signal<Comment[]>([]);
  newCommentContent = '';
  currentUser = inject(AuthService).getCurrentUser();
  userService = inject(AuthService);

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.loadComments();
    this.userService.loadCurrentUser().subscribe();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      this.addComment();
    }
  }

  loadComments() {
    this.commentService.getAll(this.taskId).subscribe(response => {
      if (response.success) {
        this.comments.set(response.data);
      }
    });
  }

  addComment() {
    if (this.newCommentContent.trim()) {
      const newComment: Comment = {
        content: this.newCommentContent,
        taskId: this.taskId,
        createdAt: new Date()
      };

      this.commentService.create(newComment).subscribe(response => {
        if (response.success) {
          this.newCommentContent = '';
          this.loadComments();
        }
      });
    }
  }

  deleteComment(commentId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.commentService.delete(commentId).subscribe(response => {
        if (response.success) {
          this.loadComments();
        }
      });
    }
  }

  canDeleteComment(comment: Comment): boolean {
    return this.currentUser?.id === comment.user?.id;
  }
}
