
import { Medicamento } from '@prisma/client'

import { IContextValue } from '../../../main/types'
import { Estado } from '../../../support/constants/estado.constant'


class MedicamentoResolver {

	async index(source, args, context: IContextValue, info): Promise<Array<Medicamento>> {
		return await context.db.medicamento.findMany({
			where: {
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

	async findOne(source, { id }: { id: number }, context: IContextValue, info): Promise<Medicamento> {
		return await context.db.medicamento.findUnique({
			where: {
				id,
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

}

export default MedicamentoResolver
