
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

 import express, { Router } from 'express'

 import { home } from '../controllers'

class Routes {
	router : Router

	constructor() {
		this.router = express.Router()

		this.router.get('/', this.getHome())
	}

	getHome() { return home.index }
}

export default Routes
