const express = require('express')
const router = express.Router()

const stripe = require('stripe')('sk_test_51HEhAgAX9HHAr5HrckEg58RbsULsbnqZSl2Hx6CITkspOuZmDuQHfmDta8m2TAzbsbC049InVUm8ZdgyiPEYXI9G00sTbO1JkT');

const { DOMAIN, BUCKET } = require('../variables')
const Product = require('../models/Product')


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
	console.log('req.body---', req.body)
    let lineItems = req.body.map(item => (
		{
			price_data: {
				currency: 'usd',
				product_data: {
					name: item.name,
					images: [`${BUCKET}/product_images/${item.name}/${item.images[0]}`]
				},
				// convert dollar amount to cents for Stripe API
				unit_amount: item.price * 100
			},
			quantity: item.qty
		}
	))


    const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: lineItems,
		mode: 'payment',
		success_url: `${DOMAIN}/success`,
		cancel_url: `${DOMAIN}/canceled`,
	})
	
    res.json({ id: session.id })
})
  






module.exports = router