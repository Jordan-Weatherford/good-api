const express = require('express')
const router = express.Router()


const { DOMAIN, BUCKET, STRIPE_KEY } = require('../variables')
const Product = require('../models/Product')

const stripe = require('stripe')(STRIPE_KEY);


// get all products
router.get('/products', async (req, res) => {
	console.log('products route hit')
	const products = await Product.find()

    res.send(products)
})


// get single product by 'slug'
router.get('/products/:slug', async (req, res) => {
	console.log('products slug route hit')
	
    const slug = req.params.slug
    const product = await Product.findOne({ slug })

    res.send(product)
})





// create checkout session
router.post('/create-checkout-session', async (req, res) => {
	console.log('create checkout session route hit')
	console.log('stipe key =====', STRIPE_KEY)

	let lineItems = await req.body.map(item => {
		console.log("===============================================")
		// get item price from database in case of frontend manipulators!
		const matchedItem = Product.findOne({ _id: item._id })
		console.log("-----------------------------------------------")		

		return({
			price_data: {
				currency: 'usd',
				product_data: {
					name: item.name,
					images: [`${BUCKET}/product_images/${item.slug}/${item.images[0]}`]
				},
				// convert dollar amount to cents for Stripe API
				unit_amount: matchedItem.price * 100
			},
			quantity: item.qty
		}
		)}
	)

	stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: lineItems,
		mode: 'payment',
		success_url: `${DOMAIN}/success`,
		cancel_url: `${DOMAIN}/cart`,
	}).then(session => {
		res.json({ success: true, id: session.id })
	}).catch(error => {
		res.send({ success: false, message: error.message })
	})
})


router.get('/', (req, res) => {
	res.send('caught ya')
})
  






module.exports = router