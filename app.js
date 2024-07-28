const express = require('express')
const config = require('config')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const PORT = config.get('port') || 3030

const exHbs = require('express-handlebars')

const viewRouter = require('./routes/view.routes')

const mainRouter = require('./routes/index.routes')
const error_handing_middleware = require('./middleware/error_handing_middleware')

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()

app.use(cookieParser()) // frontend kelyatgan cookie parse qiladi;
app.use(express.json())
const hbs = exHbs.create({
	defaultLayout: 'main',
	extname: '.hbs',
})

app.engine('hbs', hbs.engine)
app.use('/api', mainRouter)

app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static('views'))

// app.use(expressWinstonLogger);

app.use('/', viewRouter)
app.use('/api', mainRouter)
// app.use(expressWinstonErrorLogger);

// app.use(error_handing_middleware);

async function start() {
	try {
		await mongoose.connect(config.get('dbUri'))
		app.listen(PORT, () => {
			console.log('dastur ishlayapti')
			console.log(`Server is working ${PORT}- ishga tuwdi`)
		})
	} catch (error) {
		console.log('Malumotlar bazasida ulanishda xatolik')
	}
}
start()
