const Strategies = require('../model/strategies');

const createStrategy = async (data) => {
    console.log('createStrategy')

    // data = { name: 'strategy name', path: 'path string' }
    const { strategyObject } = data;
    const name = Object.keys(strategyObject)[0]

    try {
		const response = await Strategies.create({...data, name})
		console.log('Strategy created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return { status: 'error', error: 'Strategy with this name already exists' }
		}
		throw error
	}
	return { status: 'ok' }
}

const getStrategyObjects = async () => {
    console.log('getStrategyObjects')
    try {
        const strategies = await Strategies.find({ });
        const strategiesObjects = strategies.map(function(strategy) { return strategy.strategyObject; });
        return { status: 'ok', strategiesObjects }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: 'Could not get Strategy names' }
    }
}

const getStrategyPathFromName = async (name) => {
    console.log('getStrategyPathFromName')
	const strategy = await Strategies.findOne({ name }).lean();
	if (!strategy) {
		return false
	}

	return bot.path

} 

module.exports = {
    createStrategy,
	getStrategyObjects,
	getStrategyPathFromName
}