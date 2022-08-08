const User = require('../model/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './config.env' });
const JWT_SECRET = process.env.JWT_SECRET

const register = async (userData) => {
    const { username, plainTextPassword } = userData

    const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return { status: 'error', error: 'Username already in use' }
		}
		throw error
	}

	return { status: 'ok' }
}

const login = async (userData) => {
    const { username, password } = userData
    const user = await User.findOne({ username }).lean()

	if (!user) {
		return { status: 'error', error: 'Invalid username/password' }
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return { status: 'ok', data: token }
	}

	return  { status: 'error', error: 'Invalid username/password' }
    
}

const checkToken = async (data) => {
    console.log('checkToken')
    const user = jwt.verify(data.token, JWT_SECRET)
    if(user) return { status: 'ok', data: user.username }
} 

module.exports = {
    register,
    login,
    checkToken
}