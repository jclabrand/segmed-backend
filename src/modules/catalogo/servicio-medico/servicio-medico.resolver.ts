
import { ServicioMedico } from '@prisma/client'

import { IContextValue } from '../../../main/types'
import { Estado } from '../../../support/constants/estado.constant'


class ServicioMedicoResolver {

	async index(source, args, context: IContextValue, info): Promise<Array<ServicioMedico>> {
		return await context.db.servicioMedico.findMany({
			where: {
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

	async findOne(source, { id }: { id: number }, context: IContextValue, info): Promise<ServicioMedico> {
		return await context.db.servicioMedico.findUnique({
			where: {
				id,
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

}

export default ServicioMedicoResolver
