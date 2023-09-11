
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import http, { Server } from 'http'

import express, { Express } from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors'
import { json } from 'body-parser'

import Routes from './routes'
import Resolver from './resolver'
import Database from './database'

class App {
	express:	Express
	server:		Server
	graphql:	ApolloServer

	routes:	Routes
	api:	Resolver
	db:		Database

	constructor() {
		this.express = express()

		this.server = http.createServer(this.express)
		this.routes = new Routes()
		this.api = new Resolver()
		this.db = new Database()

		this.init()
	}

	async init() : Promise<void> {
		this.express.use('/', this.routes.router)

		this.graphql = new ApolloServer({
			schema: this.api.schema,
			introspection: true
		})
		await this.graphql.start()

		this.express.use(
			'/graphql',
			cors<cors.CorsRequest>(),
			json(),
			expressMiddleware(this.graphql, {
				context: this.api.buildContext({ db: this.db.client })
			})
		)

		this.server.listen(3000, () => {
			console.log('Server ready')
		})
	}
}

export default App
