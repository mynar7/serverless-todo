const axios = require('axios')
const dynamoDb = require('./dynamo')

module.exports.hello = async event => {
    // console.log(event)
    if (event.pathParameters) {
        try {
            const { data } = await axios.get(`https://www.omdbapi.com/?apikey=trilogy&t=${event.pathParameters.name}`)
            return {
                statusCode: 200,
                body: JSON.stringify(data, null, 2)
            }
        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify(err, null, 2)
            }
        }
    }
    try  {
        const result = await dynamoDb.scan({TableName: 'todo-table'}).promise()
        return {statusCode: 200, body: JSON.stringify({message: 'Success!', data: result})}
    } catch (err) {
        return {statusCode: 500, body: JSON.stringify({message: 'Error!', error: err})}
    }

    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({message: `Hello!`}, null, 2),
    // };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.add = async ({body}) => {
    try {
        const { name } = JSON.parse(body)
        if (!name) return {statusCode: 401, body: JSON.stringify({message: 'must give todo name'}, null, 2)}
        const result = await dynamoDb.put({TableName: 'todo-table', Item:{name}}).promise()
        return {statusCode: 200, body: JSON.stringify(result, null, 2)}
    } catch (err) {
        return {statusCode: 500, body: JSON.stringify({err}, null, 2)}
    }
}
module.exports.delete = async ({body}) => {
    try {
        const { name } = JSON.parse(body)
        if (!name) return {statusCode: 401, body: JSON.stringify({message: 'must give todo name'}, null, 2)}
        const result = await dynamoDb.delete({TableName: 'todo-table', Key:{name}}).promise()
        return {statusCode: 200, body: JSON.stringify(result, null, 2)}
    } catch (err) {
        return {statusCode: 500, body: JSON.stringify({err}, null, 2)}
    }
}