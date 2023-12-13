
import { Proveedor } from '@prisma/client'

import { IContextValue } from '../../../main/types'
import { Estado } from '../../../support/constants/estado.constant'


class ProveedorResolver {
	
	async index(source, args, context: IContextValue, info): Promise<Array<Proveedor>> {
		return await context.db.proveedor.findMany({
			where: {
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

	async findOne(source, { id }: { id: number }, context: IContextValue, info): Promise<Proveedor> {
		return await context.db.proveedor.findUnique({
			where: {
				id,
				NOT: { estado: Estado.Eliminado }
			}
		})
	}

	async create(source, args, context: IContextValue, info) {
	}

	async update(source, args, context: IContextValue, info) {
	}

	async delete(source, { id }: { id: number }, context: IContextValue, info) {
		return await context.db.proveedor.update({
			where: { id },
			data: { estado: Estado.Eliminado }
		})
	}
	
}

export default ProveedorResolver
