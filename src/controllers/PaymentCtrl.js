const paypal = require('paypal-rest-sdk');

const AuthProvider = require('../providers/AuthProvider');
const PaymentProvider = require('../providers/PaymentProvider');

const paypalConfig = require('../config/paypalConfig');
paypal.configure(paypalConfig);

const paypalSuccess = async (request, response) => {
	try {
		
		const { email } = request.params;
		const { paymentId, PayerID } = request.query;

		const executePaymentJson = {
		    "payer_id": PayerID,
		    "transactions": [{
		        "amount": {
		            "currency": "BRL",
		            "total": "30.00"
		        }
		    }]
		};

		paypal.payment.execute(paymentId, executePaymentJson, async (error, payment) => {
		    if (error) {
		        return response.status(401).json(error);
		    } else {

		    	await AuthProvider.setUserAsPaid(email);

		    	const user = await AuthProvider.findUserByEmail(email);
		    	const { id, cart, payer, transactions } = payment;
		    	const paymentInfo = {
		    		idUser: user[0].id_user,
		    		paymentId: id,
		    		cartId: cart,
		    		payerId: payer.payer_info.payer_id,
		    		payerEmail: payer.payer_info.email,
		    		currency: transactions[0].amount.currency,
		    		total: transactions[0].amount.total
		    	}

		    	await PaymentProvider.createPaypalPayment(paymentInfo);

		        return response.render('paypalSuccess', { name: user[0].name });

		    }
		});

	} catch (error) {
		return response.status(500).json({ message: 'Something went wrong!', error });
	}
}

const paypalCancel = async (request, response) => {
	try {
		return response.render('paypalCancel');
	} catch (error) {
		return response.status(500).json({ message: 'Something went wrong!', error });
	}
}

module.exports = { paypalSuccess, paypalCancel }