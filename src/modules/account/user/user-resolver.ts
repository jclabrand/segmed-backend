
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */


import { User } from "@prisma/client"

import { IContextValue, IAuthPayload } from '../../../main/types'
import { SubscriptionEvents } from "../../../support/constants/subscription-event.constant"
import Auth from '../../../utils/auth'


interface IUserCreateArgs {
	userName:			string
	displayName?:		string
	email?:				string

	password?:			string
	confirmPassword?:	string
}

class UserResolver {

	async index(source, args, context: IContextValue, info): Promise<User[]> {
		return await context.db.user.findMany()
	}

	async current(source, args: { bearer: string }, context: IContextValue, info): Promise<User> {
		if (context.session.id !== args.bearer) throw 'El portador no es válido.'
		return context.user
	}

	async signIn(source, args: { data: { userName: string, password: string } }, context: IContextValue, info):
		Promise<{ bearer: string, authorization: string }> {
		try {
			const { userName, password } = args.data

			const user = await context.db.user.findUnique({ where: { userName } })
			if (!user) throw 'Usuario no encontrado.'

			const psws = await context.db.userPassword.findMany({ where: { userName, status: 'A' }})
			if (psws.length !== 1) throw 'Contraseña no encontrada en base de datos.'

			const match = await Auth.compare(password, psws[0].encrypted)
			if (!match) throw 'Contraseña incorrecta.'

			const { publicKey, privateKey } = Auth.rsa()
				, payload: IAuthPayload = {
					userName,
					displayName: user.displayName
				}
				, token = await Auth.sign<IAuthPayload>(payload, privateKey)
				, session = await context.db.session.create({ data: { userName, publicKey, privateKey }})

			return {
				bearer: session.id,
				authorization: token
			}
		} catch (error) {
			throw 'Nombre de usuario o contraseña incorrecto.'
		}
	}

	async signOut(source, args: { bearer: string }, context: IContextValue, info): Promise<string> {
		const { id } = context.session

		if (id !== args.bearer) throw 'El portador no es válido.'

		const session = await context.db.session.update({ where: { id }, data: { status: 'B' } })
		return session.id
	}

	async create(source, args: { data: IUserCreateArgs }, context: IContextValue): Promise<User> {
		const { userName, displayName, email, password, confirmPassword } = args.data
		let encrypted: string

		if (password) {
			if (password !== confirmPassword) throw 'La contraseña de confirmación no coincide.'
			encrypted = await Auth.hash(password)
		}

		const usr = await context.db.user.create({
			data: {
				userName, displayName, email,
				passwords: encrypted ? {
					create: [{ encrypted }]
				} : undefined
			}
		})

		context.pubsub.publish(SubscriptionEvents.USER_CREATED, { userCreated: usr })
		return usr
	}

}

export default UserResolver
