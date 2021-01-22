const mongoose = require('mongoose')

const TestimonialSchema = new mongoose.Schema({
    'author': String,
    'statement': String
})


module.exports = mongoose.model('testimonials', TestimonialSchema );