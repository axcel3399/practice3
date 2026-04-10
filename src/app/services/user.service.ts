import { Injectable, signal, computed, effect } from '@angular/core';
export interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'})
export class UserService {

  private STORAGE_KEY = 'users';
 private _users = signal<User[]>([]);
  users = this._users.asReadonly();
loading = signal(true);

  filter = signal<'all' | 'admin' | 'user'>('all');
selectedUser = signal<User | null>(null);

  adminCount = computed(() =>
    this._users().filter(u => u.role === 'admin').length);
userCount = computed(() =>
    this._users().filter(u => u.role === 'user').length);

  filteredUsers = computed(() => {
    const f = this.filter();
    if (f === 'all') return this._users();
    return this._users().filter(u => u.role === f);
  });

  constructor() {
    const saved = sessionStorage.getItem(this.STORAGE_KEY);
    setTimeout(() => {
      if (saved) { this._users.set(JSON.parse(saved));} else {
        this._users.set([
          { id: 1, name: 'Admin', role: 'admin' },
          { id: 2, name: 'User1', role: 'user' }]);}
      this.loading.set(false);
    }, 1000);

    effect(() => {
      sessionStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this._users())
      );
    });
  }

  addUser(user: User) {
    this._users.update(users => [...users, user]);}
removeUser(id: number) {
    this._users.update(users => users.filter(u => u.id !== id));}
selectUser(user: User) {
    this.selectedUser.set({ ...user });}
updateUser(updated: User) {
    this._users.update(users =>
      users.map(u => u.id === updated.id ? updated : u));
    this.selectedUser.set(null);
  }
 cancelEdit() {
    this.selectedUser.set(null);}
}