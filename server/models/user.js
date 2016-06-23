
import { model, index } from 'mongoose-decorators';

@model({
  realm: { type: String },
  id: { type: String },
  name: { type: String },
  firstName: { type: String },
  lastName: { type: String },

  socketId: { type: String }
})
@index({ id: 1 }, { unique: true })
class User {

  static findById(realm, id) {
    return this.findOne({ realm, id }).exec();
  }

}

export default User;
