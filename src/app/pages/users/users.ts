import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'})


export class UsersPage {

  name = '';
  role: 'admin' | 'user' = 'user';

  editName = '';
  editRole: 'admin' | 'user' = 'user';

  constructor(public userService: UserService) {}

  addUser() {
    if (!this.name.trim()) return;

    this.userService.addUser({
      id: Date.now(),
      name: this.name,
      role: this.role});

    this.name = '';
    this.role = 'user';
  }

  removeUser(id: number) {
    this.userService.removeUser(id);
  }


  startEdit(user: User) {
    this.userService.selectUser(user);
    this.editName = user.name;
    this.editRole = user.role;
  }

  saveEdit() {
    const user = this.userService.selectedUser();
    if (!user) return;

    this.userService.updateUser({
      id: user.id,
      name: this.editName,
      role: this.editRole
    });
  }

  cancelEdit() {
    this.userService.cancelEdit();
  }

  setFilter(filter: 'all' | 'admin' | 'user') {
    this.userService.filter.set(filter);
  }
}
