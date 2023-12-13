
import { EspecialidadMedica } from '@prisma/client'

import { IContextValue } from '../../../main/types'
import { Estado } from '../../../support/constants/estado.constant'


class EspecialidadMedicaResolver {

	async index(source, args, context: IContextValue, info): Promise<Array<EspecialidadMedica>> {
		return await context.db.especialidadMedica.findMany({
			where: {
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

	async findOne(source, { id }: { id: number }, context: IContextValue, info): Promise<EspecialidadMedica> {
		return await context.db.especialidadMedica.findUnique({
			where: {
				id,
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

}

export default EspecialidadMedicaResolver
