const db = require('./db');
const bcrypt = require('bcrypt');

class User {
  static async findOrCreate({ accessToken, refreshToken, profile }) {
    let userId;
    let user = await db('user_via_fb').where({id_fb: profile.id}).first();
    if (!user) {
      userId = await db('user')
      .insert({
        name: profile.name.familyName
      });
      await db('user_via_fb')
      .insert({
        id_user: userId,
        id_fb: profile.id
      });
    } else {
      userId = user.id_user;
    }
    return await db('user').where({id: userId}).first();
  }

  static async createLocalUser({email}) {
    let password = await bcrypt.hash('akasa', 10); //add generation
    let idUser = await db('user').insert({
      name: email
    });
    await db('user_via_email').insert({email, password, id_user: idUser});
    return idUser;
  }

  static async getUser({ email, password }) {
    let user = await db('user_via_email')
    .where({ email }).first(); //why first?
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid user');
    }
    return await db('user').where({id: user.id_user});
  }

  static async getUserById(id) {
    return await db('user').where({id}).first();
  }
}

module.exports = User;
