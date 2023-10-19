import http from 'http';
import {
  getSongById, getSongBySinger, getAlbumById,
  updateSongById, updateAlbumById,
  getAllSong, getAllAlbum,
  addSong, addAlbum, deleteSongById, deleteAlbumById,
} from './controller.js';

// Bad Request Response
const resBadRequest = (res) => {
  res.statusCode = 400;
  res.end(JSON.stringify({ message: 'Bad Request' }));
};

// Not Found Response
const resNotFound = (res, msg) => {
  res.statusCode = 404;
  res.end(JSON.stringify({ message: `${msg} tidak ditemukan` }));
};

const requestListener = async (request, response) => {
  // splitting url & method from request
  const { method } = request;
  const url = request.url.split('/')[1];
  const params = request.url.split('/')[2];

  // tipe response menjadi JSON
  response.setHeader('Content-Type', 'application/json');

  /**
   *  Endpoint GET (plural) / 'url'
   *  Endpoint GET (singular) / 'url' / 'params'
   */
  if (method === 'GET') {
    switch (url) {
      case 'songs': {
        const songs = await getAllSong();

        response.statusCode = 200;
        const responseJson = {
          message: 'Berhasil mendapatkan data',
          songs,
        };
        return response.end(JSON.stringify(responseJson));
      }

      case 'song': {
        const song = await getSongById(params);

        if (song.length === 0) {
          return resNotFound(response, 'Lagu');
        }

        response.statusCode = 200;
        const responseJson = {
          message: 'Berhasil mendapatkan lagu',
          song: song[0],
        };
        return response.end(JSON.stringify(responseJson));
      }

      case 'singer': {
        const song = await getSongBySinger(params);

        if (song.length === 0) {
          return resNotFound(response, 'Lagu');
        }

        response.statusCode = 200;
        const responseJson = {
          message: 'Berhasil mendapatkan lagu',
          song,
        };
        return response.end(JSON.stringify(responseJson));
      }

      case 'albums': {
        const albums = await getAllAlbum();

        response.statusCode = 200;
        const responseJson = {
          message: 'Berhasil mendapatkan data',
          albums,
        };
        return response.end(JSON.stringify(responseJson));
      }

      case 'album': {
        const data = await getAlbumById(params, response);

        if (data.length === 0) {
          return resNotFound(response, 'Album');
        }

        response.statusCode = 200;
        const responseJson = {
          message: 'Berhasil mendapatkan album',
          data,
        };
        return response.end(JSON.stringify(responseJson));
      }
      default:
        resBadRequest();
        break;
    }
  }

  /**
   *  Endpoint POST / 'url'
   */
  if (method === 'POST') {
    let requestBody = '';
    request.on('data', (data) => {
      requestBody += data;
    });

    switch (url) {
      case 'song': {
        request.on('end', () => {
          // validate body
          if (requestBody === '') {
            return resBadRequest(response);
          }

          addSong(requestBody);

          response.statusCode = 201;
          const responseJson = {
            message: 'Berhasil menambahkan lagu',
          };
          return response.end(JSON.stringify(responseJson));
        });
        break;
      }

      case 'album': {
        request.on('end', () => {
          // validate body
          if (requestBody === '') {
            return resBadRequest(response);
          }

          addAlbum(requestBody);

          response.statusCode = 201;
          const responseJson = {
            message: 'Berhasil menambahkan album',
          };
          return response.end(JSON.stringify(responseJson));
        });
        break;
      }
      default:
        resBadRequest(response);
        break;
    }
  }

  /**
   *  Endpoint PUT / 'url' / 'params'
   */
  if (method === 'PUT') {
    let requestBody = '';
    request.on('data', (data) => {
      requestBody += data;
    });

    switch (url) {
      case 'song':
        request.on('end', () => {
          // validate body
          if (requestBody === '') {
            return resBadRequest(response);
          }

          const data = updateSongById(requestBody, params);

          if (data === -1) {
            return resNotFound(response, 'Lagu');
          }

          const responseJson = {
            message: 'Data berhasil diubah',
            data,
          };
          return response.end(JSON.stringify(responseJson));
        });
        break;

      case 'album':
        request.on('end', () => {
          // validate body
          if (requestBody === '') {
            return resBadRequest(response);
          }

          const data = updateAlbumById(requestBody, params);

          if (data === -1) {
            return resNotFound(response, 'Album');
          }

          const responseJson = {
            message: 'Data berhasil diubah',
            data,
          };
          return response.end(JSON.stringify(responseJson));
        });
        break;
      default:
        resBadRequest(response);
        break;
    }
  }

  /**
   *  Endpoint DELETE / 'url' / 'params'
   */
  if (method === 'DELETE') {
    switch (url) {
      case 'song': {
        const data = deleteSongById(params);

        if (data === -1) {
          return resNotFound(response, 'Lagu');
        }

        const responseJson = {
          message: 'Lagu berhasil dihapus',
        };
        return response.end(JSON.stringify(responseJson));
      }

      case 'album': {
        const data = deleteAlbumById(params);

        if (data === -1) {
          return resNotFound(response, 'Album');
        }

        const responseJson = {
          message: 'Album berhasil dihapus',
        };
        return response.end(JSON.stringify(responseJson));
      }
      default:
        resBadRequest();
        break;
    }
  }
  return true;
};

const app = http.createServer(requestListener);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
