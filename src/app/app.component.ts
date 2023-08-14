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
    this.checkLogin();
    this.getUsers();
  }
  users: any = [];
  newUser: any = {
    name: '',
    email: '',
  };
  editUser: any = {
    id: '',
    name: '',
    email: '',
  };
  login: any = {
    username: '',
    password: '',
  };
  isLogin = false;
  username = '';

  checkLogin() {
    let token = localStorage.getItem('token');
    this.username = localStorage.getItem('username') || '';
    console.log(token);

    this.service.authen({ token: token }).subscribe((res) => {
      const newObj: any = res;

      if (newObj.status == 'ok') {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
      console.log('isLogin ', this.isLogin);
    });
  }
  clickLogin() {
    localStorage.setItem('username', this.login.username);
    // localStorage.setItem('password', this.login.username);
    let data = {
      username: this.login.username,
      password: this.login.password,
    };

    this.service.login(data).subscribe((res) => {
      const newObj: any = res;
      if (newObj.status == 'ok') {
        // login สำเร็จ เก็บ token
        localStorage.setItem('token', newObj.token);
        this.isLogin = true;
        this.username = this.login.username;
        console.log(this.username);
      }else{
        alert('username or password is invalid')
      }
    });
  }
  logout() {
    localStorage.clear();
    this.isLogin = false;
    console.log('logout');
  }
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
