
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import { Request } from 'express'
import { PrismaClient, User, Session } from "@prisma/client"
import { PubSub } from 'graphql-subscriptions'

interface IContextValue {
	req:		Request
	db:			PrismaClient
	pubsub:		PubSub
	user?:		User
	session?:	Session
}

interface IAuthPayload {
	userName:		string
	displayName:	string
}

enum SubscriptionEvents {
	USER_ADDED = 'PSE_UA'
}

export { IContextValue, IAuthPayload, SubscriptionEvents }
