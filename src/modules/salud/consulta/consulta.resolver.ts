
import { Consulta } from '@prisma/client'

import { IContextValue } from '../../../main/types'
import { Estado } from '../../../support/constants/estado.constant'


class ConsultaResolver {

	async index(source, args, context: IContextValue, info): Promise<Array<Consulta>> {
		return await context.db.consulta.findMany({
			where: {
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

	async findOne(source, { id }: { id: number }, context: IContextValue, info): Promise<Consulta> {
		return await context.db.consulta.findUnique({
			where: {
				id,
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

}

export default ConsultaResolver
