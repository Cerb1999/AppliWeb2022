export const environment = {
  production: true,
  backend: {
    protocol: 'http',
    host: 'localhost',
    port: '3000',
    endpoints: {
      allAlbums: '/albums',
      oneAlbum: '/albums/:id',
      randomAlbum: 'albums/random',
      allMusics: '/musics',
      oneMusic: '/musics/:id',
      randomMusicNoAlbum: '/musics/random',
      allMusicsOneAlbum: 'musics/albums/:id',
      randomMusicOneAlbum: 'musics/random/albums/:id',
    },
  },
};