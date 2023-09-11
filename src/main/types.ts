
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import { PrismaClient } from "@prisma/client"

interface IContextValue {
	db:	PrismaClient
}

export { IContextValue }
