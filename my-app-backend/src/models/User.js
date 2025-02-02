const users = []; 

class User {
  constructor({ googleId, name, email, avatar }) {
    this.id = Date.now().toString();
    this.googleId = googleId;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
  }

  static findByGoogleId(googleId) {
    return users.find(user => user.googleId === googleId);
    
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  save() {
    users.push(this);
    console.log('Saved user:', this);
    return this;
  }
}
console.log('Users:', users);


module.exports = User;