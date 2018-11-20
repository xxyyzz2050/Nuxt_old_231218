module.exports = [
  {
    shortId: 'string',
    object: 'string', //table name; nx: object:{type:objectId, ref:$table}
    //int: 'number', //id integer value (unique), auto increment
    link: 'string', //link_title (unique)
    username: 'string',
    modifiedAt: { type: Date, default: Date.now }
  }
]

//use this table to create a unique _id & link accross all of the database
//_id & shortId are copies from the original table
// /shortId or /shortId-link.. or /int-link..
