import { SupplierRelevance } from '@prisma/client'

import { IContextValue } from '../../../main/types'

interface ISupplierRelevanceArgs {
	address: string,
	phone: string,
	name: string
}
class SupplierRelevanceResolver {

    async index(source, args, context: IContextValue, info): Promise<Array<SupplierRelevance>> {
		return await context.db.supplierRelevance.findMany()
	}

	async findOne(source, { id }: { id: string }, context: IContextValue, info): Promise<SupplierRelevance> {
		return await context.db.supplierRelevance.findUnique({
			where: { id }
		})
	}
	async create(source, { data }: { data: ISupplierRelevanceArgs }, context: IContextValue, info) {

		return await context.db.supplierRelevance.create({
			data: {
				address: data.address,
				phone: data.phone,
				supplierId: ""
				
			}
		})
	}
}

export default SupplierRelevanceResolver
