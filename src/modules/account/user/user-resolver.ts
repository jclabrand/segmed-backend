
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import { Prisma, User } from "@prisma/client"

import { IContextValue } from '../../../main/types'

class UserResolver {

	async index(source, args, context: IContextValue, info) : Promise<User[]> {
		return await context.db.user.findMany()
	}

	async create(source, args: Prisma.UserCreateArgs, context: IContextValue): Promise<User> {
		return await context.db.user.create(args)
	}

}

export default UserResolver
