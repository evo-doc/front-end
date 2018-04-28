"use strict";

const Storage = require("storage.module");

class Authorization {
   constructor() {
      this._storage;
   }

   init() {
      // Init storage
      this._storage = new Storage("localization", {
         token: "NEW_token"
      });
   }

   _parseIDfromToken(token) {
      return +token.substr(0, 10);
   }

   _getToken() {
      return this._storage.getData("token");
   }

   saveToken(token) {
      this._storage.setData("token", this._token);
   }

   async sendAuthorization(username, password) {
      return await connect.postJSON("/login", {
         username: username,
         password: password
      });
   }

   async sendRegistration(username, password, email) {
      return await connect.postJSON("/registration", {
         username: username,
         password: password,
         email: email
      });
   }

   async sendVerification(code = "") {
      let token = this._getToken();
      return await connect.postJSON("/user/activation", {
         user_id: this._parseIDfromToken(token),
         token: token,
         code: code
      });
   }

   async sendDelete() {
      //
   }

   async isAuthorised() {
      // return new Promise((verified, unverified) => {});
   }
}

module.exports = Authorization;
