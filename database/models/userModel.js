const db = require('../dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex');
const secret = 'lambdasuperdupersecret';

class DataTable {
    
    constructor(table, primaryKeyName = 'id'){
        this.primaryKeyName = primaryKeyName;
        this.dbTable = () => db(table);
    }

    getAll(){
        return this.dbTable();
    }

    getByKey(key){
        return this.dbTable()
            .where({[this.primaryKeyName]: key})
            .first();
    }

    insert(newItem){
        return this.dbTable()
            .insert(newItem)
            .then( keyArray => this.getByKey(keyArray[0]) );
    }

    update(key, updatedData){
        return this.dbTable()
            .where({[this.primaryKeyName]: key})
            .update(updatedData);
    }

    delete(key){
        return this.dbTable()
            .where({[this.primaryKeyName]: key})
            .del();
    }

    get_dbTable(){
        return this.dbTable();
    }

}

class UserTable extends DataTable {
    constructor(){
        super('users');
    }

    generateToken(userData){
        const payload = {
            subject: userData.id,
            username: userData.username,
            created: new Date()
        };

        const options = {
            expiresIn: '1d'
        };

        return jwt.sign(payload, secret, options);
    }

    async insertUser(userData){
        const { username, password } = userData;
        const hashedPass = await bcrypt.hashSync(password);
        return this.dbTable()
            .insert({username: username, password: hashedPass})
            .then( keys => this.getByKey( keys[0]) );
    }

    async attemptAuth(userData){
        const { username, password } = userData;

        const selectedUser = await this.dbTable()
                                       .where({username})
                                       .first();
        if( await bcrypt.compareSync(password, selectedUser.password) ){
            const token = await this.generateToken({selectedUser});
            return {username: selectedUser.username, token};
        } else {
            throw new Error('Incorrect Credentials');
        }
    }
}

const users = new UserTable();


module.exports = {
                    DataTable,
                    db,
                    users
                 };