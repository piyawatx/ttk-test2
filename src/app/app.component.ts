import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private service: UserService) {}
  ngOnInit() {
    this.getUsers();
  }
  users: any;
  newUser: any = {
    name: '',
    email: '',
  };
  editUser: any = {
    id: '',
    name: '',
    email: '',
  };
  isLogin = false;

  getUsers() {
    this.service.getUsers().subscribe((res) => {
      this.users = res;
      console.log(this.users);
    });
  }
  addUser() {
    let newUser = {
      name: this.newUser.name,
      email: this.newUser.email,
    };

    this.service.create(newUser).subscribe((res) => {
      console.log(res);
      this.getUsers();
    });
    this.clearNewUser();
  }

  clickEdit(id: number) {
    this.clearEditUser();
    this.service.getUserById(id).subscribe((res) => {
      this.editUser = res;
      console.log(res);
    });
  }
  update() {
    this.service.update(this.editUser).subscribe((res) => {
      console.log(res);
      this.getUsers();
    });
  }
  delete(id: number) {
    this.service.delete(id).subscribe((res) => {
      console.log('delete', id);
      this.getUsers();
    });
  }

  clearNewUser() {
    this.newUser.name = '';
    this.newUser.email = '';
  }
  clearEditUser() {
    this.editUser.name = '';
    this.editUser.email = '';
  }
}
