const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const paypal = require('paypal-rest-sdk');

const AuthProvider = require('../providers/AuthProvider');
const PaymentProvider = require('../providers/PaymentProvider');

const paypalConfig = require('../config/paypalConfig');
paypal.configure(paypalConfig);

const signup = async (request, response) => {
	try {

		/* Pega as informações do usuário */
		const { name, email, password, confirmPassword, paymentType, profileImageUrl } = request.body;

		/* Verifica se os campos foram preenchidos */
		if (!name || !email || !password || !confirmPassword || !paymentType) {
			return response.status(401).json({ message: 'Você precisa informar todos os campos' });
		}

		/* Verifica se as senhas são iguais */
		if (password !== confirmPassword) {
			return response.status(401).json({ message: 'As senha não são iguais' });
		}

		const foundUser = await AuthProvider.findUserByEmail(email); /* Procura um usuário com esse e-mail */

		/* Verifica se já existe algum usuário */
		if (foundUser.length !== 0) {
			return response.status(401).json({ message: 'Um usuário já possui esse e-mail' });
		}

		const cryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
		const user = { name, email, password: cryptedPassword, createdAt: new Date().toISOString(), paid: false, profileImageUrl }

		/* Verifica se o metodo de pagamento é pelo PayPal */
		if (paymentType == 'paypal') {
			
			const createPaymentJson = {
			    "intent": "sale",
			    "payer": {
			        "payment_method": "paypal"
			    },
			    "redirect_urls": {
			        "return_url": `http://localhost:3000/api/paypalSuccess/${email}`,
			        "cancel_url": "http://localhost:3000/api/paypalCancel"
			    },
			    "transactions": [{
			        "item_list": {
			            "items": [{
			                "name": "Conta no app Video Uploader",
			                "sku": "item",
			                "price": "30.00",
			                "currency": "BRL",
			                "quantity": 1
			            }]
			        },
			        "amount": {
			            "currency": "BRL",
			            "total": "30.00"
			        },
			        "description": "Pagamento para liberação de conta no app Video Uploader"
			    }]
			}

			paypal.payment.create(createPaymentJson, async (error, payment) => {
			    if (error) {
			        return response.status(401).json(error);
			    } else {					
					await AuthProvider.createNewUser(user);
			        return response.redirect(payment.links[1].href);
			    }
			});

		}

	} catch (error) {
		return response.status(500).json({ message: 'Something went wrong!', error });
	}
}

const signin = async (request, response) => {
	try {

		const { email, password } = request.body;

		if (!email || !password) {
			return response.status(401).json({ message: 'Você precisa informar todos os campos' });
		}

		const user = await AuthProvider.findUserByEmail(email);
		
		if (user.length == 0) {
			return response.status(401).json({ message: 'Usuário não encontrado' });
		}

		if (bcrypt.compareSync(password, user[0].password)) {
			
			const { id_user, name, email, paid } = user[0];
			const token = jwt.sign({ id_user, name, email, paid }, process.env.TOKEN_SECRET, { expiresIn: '1 day' });
			return response.status(200).json({ id_user, name, email, paid: paid == 1 ? true : false, token });

		} else {
			return response.status(401).json({ message: 'E-mail ou senha incorretos' });
		}

	} catch (error) {
		return response.status(500).json({ message: 'Something went wrong!', error });
	}
}

module.exports = { signup, signin }