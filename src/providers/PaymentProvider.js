const connection = require('../config/database');

const createPaypalPayment = (info) => {
	return new Promise(async (resolve, reject) => {
		try {

			const { idUser, paymentId, cartId, payerId, payerEmail, currency, total } = info;

			const query = `INSERT INTO tb_paypal_payment_information
				(fk_id_user, payment_id, cart_id, payer_id, payer_email, currency, total) VALUES
				('${idUser}', '${paymentId}', '${cartId}', '${payerId}', '${payerEmail}', '${currency}', ${total})
			`;

			connection.query(query, (error, results) => {
				if (error) {
					return reject(error);
				} else {
					return resolve(results);
				}			
			});

		} catch (error) {
			return reject(error);
		}
	});
}

module.exports = { createPaypalPayment }