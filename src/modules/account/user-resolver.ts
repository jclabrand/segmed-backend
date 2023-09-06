
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import { IContextValue, IUser } from '../types'

class UserResolver {

	async index(source, args, context: IContextValue, info) : Promise<[IUser?, IUser?]> {
		return [
			{id:"615", userName:"ereyes", displayName:"Edwin Reyes"},
			{id:"87", userName:"gpacheco", displayName:"Gunnar Reyes"}
		]
	}

	async user() {
		return {id:"615", userName:"ereyes", displayName:"Edwin Reyes"}
	}

}

export default UserResolver
