
import { Beneficiario } from '@prisma/client'

import { IContextValue } from '../../../main/types'
import { Estado } from '../../../support/constants/estado.constant'


class BeneficiarioResolver {

	async index(source, args, context: IContextValue, info): Promise<Array<Beneficiario>> {
		return await context.db.beneficiario.findMany({
			where: {
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

	async findOne(source, { id }: { id: number }, context: IContextValue, info): Promise<Beneficiario> {
		return await context.db.beneficiario.findUnique({
			where: {
				id,
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

}

export default BeneficiarioResolver
