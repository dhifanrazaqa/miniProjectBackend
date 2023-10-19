import { songs, albums } from './data.js';

// menampilkan data dengan mengembalikan promise agar async
const displayData = (callback) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(callback());
  }, 1500);
});

// menampilkan semua lagu
const getAllSong = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(songs);
  }, 1500);
});

// menampilkan lagu berdasarkan id
const getSongById = async (params) => {
  const song = await displayData(() => {
    const dataFind = songs.filter((item) => item.id === params);
    return dataFind;
  });

  return song;
};

// menampilkan lagu berdasarkan penyanyinya
const getSongBySinger = async (params) => {
  const song = await displayData(() => {
    const dataFind = songs.filter((item) => item.singer === params);
    return dataFind;
  });

  return song;
};

// menambah lagu
const addSong = (requestBody) => {
  const { id } = songs[songs.length - 1];
  const lastId = parseInt(id.split('-')[1], 10);
  const newId = `song-${(lastId + 1).toString().padStart(3, '0')}`;
  let body = JSON.parse(requestBody);

  body = {
    id: newId,
    ...body,
  };

  songs.push(body);
};

// mengubah data pada lagu
const updateSongById = (requestBody, params) => {
  const body = JSON.parse(requestBody);
  const index = songs.findIndex((item) => item.id === params);

  if (index === -1) {
    return index;
  }

  songs[index] = {
    ...songs[index],
    ...body,
  };

  return songs[index];
};

// menghapus lagu
const deleteSongById = (params) => {
  const index = songs.findIndex((item) => item.id === params);

  if (index === -1) {
    return index;
  }

  songs.splice(index, 1);

  return true;
};

// mendapatkan semua album
const getAllAlbum = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(albums);
  }, 1500);
});

// mendapatkan album beserta dengan lagu-lagunya
const getAlbumById = async (params) => {
  const album = await displayData(() => {
    const dataFind = albums.filter((item) => item.albumId === params);
    return dataFind;
  });

  if (album.length === 0) {
    return [];
  }

  const { albumId } = album[0];

  const song = await displayData(() => {
    const dataFind = songs.filter((item) => item.albumId === albumId);
    return dataFind;
  });

  const data = {
    ...album[0],
    song,
  };

  return data;
};

// menambahkan album
const addAlbum = (requestBody) => {
  const { albumId } = albums[albums.length - 1];
  const lastId = parseInt(albumId.split('-')[1], 10);
  const newId = `album-${(lastId + 1).toString().padStart(3, '0')}`;
  let body = JSON.parse(requestBody);

  body = {
    albumId: newId,
    ...body,
  };

  albums.push(body);
};

// mengubah data pada album
const updateAlbumById = (requestBody, params) => {
  const body = JSON.parse(requestBody);
  const index = albums.findIndex((item) => item.albumId === params);

  if (index === -1) {
    return index;
  }

  albums[index] = {
    ...albums[index],
    ...body,
  };

  return albums[index];
};

// menghapus album
const deleteAlbumById = (params) => {
  const index = albums.findIndex((item) => item.albumId === params);

  if (index === -1) {
    return index;
  }

  albums.splice(index, 1);

  return true;
};

export {
  getSongById, getSongBySinger, getAlbumById,
  deleteSongById, deleteAlbumById,
  updateSongById, updateAlbumById,
  getAllSong, getAllAlbum,
  addSong, addAlbum,
};
