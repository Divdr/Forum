module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    /**
     * create admin when migrate database
     */
    const role = await db.collection('roles').findOne({name:'admin'})
    const admin={
      roles : role._id,
      password: "$2a$10$U.JIz8jtaejqKrJRmpq3NuzsyIHz.WxMLk42o6jLbkqsFa0alP6Fa", //12345678
      email: "admin@gmail.com",
      createdAt : new Date(),
      updatedAt : new Date(),
      __v : 0
    }

    await db.collection('users').insertOne(admin)

    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    /**
     * remove admin when delete database
     */
    await db.collection('users').deleteOne({email:'admin@gmail.com'})

    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
