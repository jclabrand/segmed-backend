
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import http, { Server } from 'http'

import express, { Express } from 'express'

import Routes from './routes'

class App {
	express : Express
	server : Server
	routes : Routes

	constructor() {
		this.express = express()

		this.server = http.createServer(this.express)
		this.routes = new Routes()

		this.express.use('/', this.routes.router)

		this.server.listen(3000, () => {
			console.log('Server ready')
		})
	}
}

export default App
