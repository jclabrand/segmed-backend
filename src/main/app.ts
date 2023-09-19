
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import http, { Server } from 'http'

import express, { Express } from 'express'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
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

		const httpServer = this.server
			, schema = this.api.schema
			, wsServer = new WebSocketServer({
				server: httpServer,
				path: '/graphql',
			})
			, serverCleanup = useServer({ schema }, wsServer)

		this.graphql = new ApolloServer({
			schema,
			plugins: [
				ApolloServerPluginDrainHttpServer({ httpServer }),
				{
					async serverWillStart() {
						return {
							async drainServer() {
								await serverCleanup.dispose()
							}
						}
					}
				}
			],
			introspection: true
		})

		await this.graphql.start()

		this.express.use(
			'/graphql',
			cors<cors.CorsRequest>(),
			json(),
			expressMiddleware(this.graphql, {
				context: this.api.buildContext(this.db.client, this.api.pubsub)
			})
		)

		this.server.listen(3000, () => {
			console.log('Server ready')
		})
	}
}

export default App
