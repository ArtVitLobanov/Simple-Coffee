import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
    selector: 'app-user-profile-component',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './user-profile-component.html',
    styleUrl: './user-profile-component.css',
})
export class UserProfileComponent implements OnInit {

    constructor(
        public authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.authService.authUser()
    }
}
