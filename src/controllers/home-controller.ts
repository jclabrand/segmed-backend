
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import { Request, Response } from 'express'

class HomeController {
	index(_: Request, res: Response) {
		res.json({ message: 'SEGMED API Services' })
	}
}

export default HomeController
