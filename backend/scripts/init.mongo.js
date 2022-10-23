db.createCollection("albums");
db.createCollection("musics");

let albums = db.getCollection('albums');
albums.insertMany([
  {
    name: 'Lo-fi',
    addedToApiDate: new Date(),
  },
  {
    name: 'Rap',
    addedToApiDate: new Date(),
  }
]);

let lofi = albums.findOne({'name':'Lo-fi'});
db.getCollection('musics').insertMany([
  {
    name: 'Lo-fi Type Beat - Lovely',
    albums: [lofi],
  },
  {
    name: 'LoFi Chillhop Bake A Pie by Lukrembo',
    albums: [lofi],
  },
  {
    name: 'lofi type beat “biscuit” by lukrembo',
    albums: [lofi],
  },
]);

db.getCollection('musics').find({});
db.getCollection('albums').find({});
