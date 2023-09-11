
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

 import { PrismaClient,  } from "@prisma/client"

 class Database {
	client: PrismaClient

	constructor() {
		this.client = new PrismaClient()
	}
 }

 export default Database
 