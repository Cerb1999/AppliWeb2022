db.createCollection("albums");
db.createCollection("musics");

let albums = db.getCollection('albums');
albums.insertMany([
  {
    name: 'Lo-fi',
  },
  {
    name: 'Rap',
  }
]);

let lofi = albums.findOne({'name':'Lo-fi'});
db.getCollection('musics').insertMany([
  {
    name: 'Lo-fi Type Beat - Lovely',
    addedToApiDate: new Date(),
    albums: [lofi],
  },
  {
    name: 'LoFi Chillhop Bake A Pie by Lukrembo',
    addedToApiDate: new Date(),
    albums: [lofi],
  },
  {
    name: 'lofi type beat “biscuit” by lukrembo',
    addedToApiDate: new Date(),
    albums: [lofi],
  },
]);

db.getCollection('musics').find({});
db.getCollection('albums').find({});
