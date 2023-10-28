import { SupplierRelevanceType } from '@prisma/client'

import { IContextValue } from '../../../main/types'

class SupplierRelevance{

	async index(source, args, context: IContextValue, info): Promise<Array<SupplierRelevanceType>> {
		return await context.db.supplierRelevanceType.findMany()
	}

	async findOne(source, { id }: { id: string }, context: IContextValue, info): Promise<SupplierRelevanceType> {
		return await context.db.supplierRelevanceType.findUnique({
			where: { id }
		})
	}
	
}
export default SupplierRelevance