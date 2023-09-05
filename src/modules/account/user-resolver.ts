
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import { IContextValue, IUser } from '../types'

class UserResolver {

	async index(source, args, context: IContextValue, info) : Promise<[IUser?]> {
		return []
	}

}

export default UserResolver
