const express = require('express')
const router = express.Router()


const { DOMAIN, BUCKET, STRIPE_KEY } = require('../variables')
const Product = require('../models/Product');
const { response } = require('express');

const stripe = require('stripe')(STRIPE_KEY);


// get all products
router.get('/products', async (req, res) => {
	const products = await Product.find()

    res.send(products)
})


// get single product by 'slug'
router.get('/products/:slug', async (req, res) => {	
    const slug = req.params.slug
    const product = await Product.findOne({ slug })

    res.send(product)
})



// create checkout session
router.post('/create-checkout-session', async (req, res) => {
	const cartItems = req.body

	let dbItems = await Product.find({ _id: cartItems })
	let lineItems = []

	for (let i = 0; i < cartItems.length; i++) {
		lineItems.push({
			price_data: {
				currency: 'usd',
				product_data: {
					name: dbItems[i].name,
					images: cartItems[i].images
				},
				unit_amount: dbItems[i].price * 100
			},
			quantity: cartItems[i].qty			
		})
	}

	stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: lineItems,
		mode: 'payment',
		success_url: `${DOMAIN}/success`,
		cancel_url: `${DOMAIN}/cart`,
	}).then(session => {
		res.json({ success: true, id: session.id })
	}).catch(error => {
		console.log(error)
		res.send({ success: false, message: error.message })
	})
})


router.get('/', (req, res) => {
	res.send("Error! There is nothing here")
})
  
module.exports = router