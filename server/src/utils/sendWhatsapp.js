const axios = require('axios');

const sendWhatsapp = async ({ target, message }) => {

  try {

    const response = await axios.post(
      'https://api.fonnte.com/send',
      {
        target,
        message,
      },
      {
        headers: {
          Authorization: process.env.FONNTE_API_KEY,
        },
      }
    );

    if (response.data.status === true) {
      console.log(
        `[FONNTE] SUCCESS -> ${target}`
      );
      return response.data;
    } else {
      throw new Error(
        `FONNTE API returned false: ${response.data.reason || 'Unknown error'}`
      );
    }

  } catch (err) {

    console.error(
      `[FONNTE] FAILED -> ${target}`,
      err.response?.data || err.message
    );

    throw err;
  }
};

module.exports = { sendWhatsapp };