
import { SupplierServiceType } from '@prisma/client'

import { IContextValue } from '../../../main/types'


class SupplierServiceTypeResolver {

	async index(source, args, context: IContextValue, info): Promise<Array<SupplierServiceType>> {
		return await context.db.supplierServiceType.findMany()
	}

	async findOne(source, { id }: { id: string }, context: IContextValue, info): Promise<SupplierServiceType> {
		return await context.db.supplierServiceType.findUnique({
			where: { id }
		})
	}

	async create(source, { data }: { data: { name: string } }, context: IContextValue, info) {
		return await context.db.supplierServiceType.create({
			data
		})
	}
}


export default SupplierServiceTypeResolver
