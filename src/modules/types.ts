
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

interface IContextValue {
	auth?: String
}

interface IUser {
	id: String
	userName: String
	displayName?: String
}

export { IUser, IContextValue }
