var _ = require('lodash');
const neo4j = require('neo4j-driver')
const uri = "neo4j+s://d4a1a13c.databases.neo4j.io:7687";
const user = "neo4j";
const password = "eTss2w7zGGVYd_R02r2kmUQfggU05qDTk5WPHiL7FsQ";
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

const session = driver.session()

const User = require("../models/User")



let _manyUsers = function (result) {
  return result.records.map(r => (r.get('user')));
};
let _user = function (result) {
  return result.records.map(r => (r.get('user')));
};

let getAllUsers = async function () {
  try {
    const result = await session.run('MATCH (user:User) RETURN user');
  return _manyUsers(result);
  } catch (error) {
    await session.close();
  }
  

};
let updateUser = async function (parameters) {
  // console.log(parameters)
  let updatedProperties = {
    first_name: parameters.properties.first_name,
    last_name: parameters.properties.last_name,
    email: parameters.properties.email,
    gender: parameters.properties.gender,
    phone: parameters.properties.phone
  };

    let statementText = `
    MATCH (user:User) WHERE ID(user) = ${parameters.id} SET 
    user.first_name="${updatedProperties.first_name}", 
    user.last_name="${updatedProperties.last_name}", 
    user.email="${updatedProperties.email}", 
    user.phone="${updatedProperties.phone}", 
    user.gender="${updatedProperties.gender}" 
    RETURN user`;
    // let statementParameters = _user(updatedProperties)
    let result = await session.run(statementText)
    console.log(_user(result))
    return _user(result);
 
};
let getUser = async function (userId) {
  try {
    const result = await session.run(`MATCH (user:User) WHERE ID(user) = ${userId} RETURN user`);
    return _user(result);
  } catch (error) {
    await session.close()
  }

}

async function getOneUser(userId) {
  let user;
  await getUser(userId).then((node) => {
    user = new User(
      node[0].identity.low,
      node[0].properties.first_name,
      node[0].properties.last_name,
      node[0].properties.email,
      node[0].properties.phone,
      node[0].properties.gender);


  });
  return user;
}
async function showNewUser(node) {
  let user;
  
    user = new User(
      node[0].identity.low,
      node[0].properties.first_name,
      node[0].properties.last_name,
      node[0].properties.email,
      node[0].properties.phone,
      node[0].properties.gender);



  return user;
}
async function getUsers() {
  const nodes = await getAllUsers();
  // console.log(nodes)
  let users = [];
  nodes.forEach(node => {
    const user = new User(
      node.identity.low,
      node.properties.first_name,
      node.properties.last_name,
      node.properties.email,
      node.properties.phone,
      node.properties.gender);
    users.push(user)
  });
  return users;
}
let createUser = async function (parameters) {
  let statement = `CREATE (user:User 
    {first_name: "${parameters.first_name}", 
    last_name:"${parameters.last_name}", 
    email:"${parameters.email}", 
    phone:"${parameters.phone}", 
    gender:"${parameters.gender}"}) RETURN user`
    try {
      const node = await session.run(statement);
      const mappedNode = _user(node);
      const newUser = showNewUser(mappedNode);
      
     return newUser;

    } catch (error) {
      console.log(error);
      await session.close();
    }
    
}

let deleteUser = async function(id){
  let statement = `MATCH (u:User ) WHERE id(u)=${id}
  DELETE u`
  try {
    await session.run(statement);
  } catch (error) {
    console.log(error);
    await session.close();
  }
}



module.exports = {
  getUsers: getUsers,
  getOneUser: getOneUser,
  updateUser: updateUser,
  createUser: createUser,
  deleteUser: deleteUser
};