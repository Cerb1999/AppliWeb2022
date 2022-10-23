db.getCollection('musics').createIndex(
  { name: 1},
  { unique: true },
);


db.getCollection('albums').createIndex(
  { name: 1},
  { unique: true },
);