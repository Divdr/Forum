module.exports = {
  /**
   * create roles in database when database migrate
   * @param {*} db 
   * @param {*} client 
   */
  async up(db, client) {
    // TODO write your migration here.
    const roles =[
      {
        name:"admin"
      },
      {
        name:"user"
      }
    ]

    await db.collection('roles').insertMany(roles)
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    /**
     * remove roles from database when database deleted
     */
    // TODO write the statements to rollback your migration (if possible)
    await db.collection('roles').deleteMany([{name:'admin'},{name:'user'}])
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
