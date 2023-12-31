import fs from "fs";
import crypto from "crypto";
//const { json } = require("react-router-dom");

class UserManager {
  static #users = [];
  init() {
    const exists = fs.existsSync(this.path);
    //console.log(exists);
    if (!exists) {
      fs.writeFileSync(this.path, JSON.stringify([], null, 2));
    } else {
      UserManager.#users = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    }
  }
  constructor(path) {
    this.path = path;
    this.init();
  }
  async create(data) {
    try {
      if (!data.name || !data.photo || !data.email) {
        throw new Error("Name, Photo, Email are require");
      } else {
        const user = {
          id: crypto.randomBytes(12).toString("hex"),
          name: data.name,
          photo: data.photo,
          email: data.email,
        };
        UserManager.#users.push(user);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(UserManager.#users, null, 2)
        );
        console.log("Create ID:" + user.id);
        return user.id;
      }
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  read() {
    try {
        if(UserManager.#users.length === 0){
            throw new Error("There aren't users");
        } else {
            console.log(UserManager.#users);
            return UserManager.#users;
        }
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  readOne(id){
    try {
        const one = UserManager.#users.find(each => each.id === id);
        if(one){
            console.log(one);
            return one;
        } else {
            throw new Error("There isnt user with ID: " + id);
        }
    } catch (error) {
        console.log(error.message);
      return error.message;
    }
  }
  async destroy(id){
    try {
        const one = UserManager.#users.find(each => each.id === id);
        if(one){
            UserManager.#users = UserManager.#users.filter(each => each.id !==id);
            await fs.promises.writeFile(this.path, JSON.stringify(UserManager.#users, null, 2));
            console.log("Destroyed ID: "+ id);
            return id;
        } else {
            throw new Error("There isnt user with ID: " + id);
        }
    } catch (error) {
        console.log(error.message);
        return error.message; 
    }
  }
}

const users = new UserManager("./data/fs/files/users.json");
export default users;



