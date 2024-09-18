import { TIMEOUT_SEC } from './config';

// To Timeout Link Fetching
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, upload = undefined) {
  try {
    const fetchPro = upload
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(upload),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`${res.status} \n${res.statusText} \n${data.message}`);

    return data;
  } catch (err) {
    throw err;
  }
};

/*
// To Fetch links
export const getJson = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`${res.status} \n${res.statusText} \n${data.message}`);

    return data;
  } catch (err) {
    throw err;
  }
};

// To Fetch links
export const sendJson = async function (url, upload) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(upload),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`${res.status} \n${res.statusText} \n${data.message}`);

    return data;
  } catch (err) {
    throw err;
  }
};
*/
