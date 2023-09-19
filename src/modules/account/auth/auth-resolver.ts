
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import { IContextValue, IAuthPayload } from '../../../main/types'
import Auth from '../../../utils/auth'

class AuthResolver {

	authorized(resolve) {
		return async function(source, args, context: IContextValue, info) {
			const { headers } = context.req

			if (headers && headers.authorization) {
				const authData = headers.authorization.split(' ')
					, session = await context.db.session.findUnique({ where: { id: authData[0] } })

				if (!session) throw 'El portador no es válido.'
				if (session.status !== 'A') throw 'Sesión de usuario no es válido.'

				const payload = await Auth.verify<IAuthPayload>(authData[1], session.publicKey)
					, user = await context.db.user.findUnique({ where: { userName: payload.userName } })

				context.user = user
				context.session = session

				return resolve(source, args, context, info)
			}
			else throw 'El usuario no tiene credenciales.'
		}
	}
}

export default AuthResolver
