import { SupplierSpecialtyType } from '@prisma/client'

import { IContextValue } from '../../../main/types'

class SupplierSpecialtyTypeResolver{

//	async index(source, args, context, info){
//		return[{
//			id: 'prueba que devuelve los datos',
//			name: 'algo 2'
//		}]
//	}
	
	async index(source, args, context: IContextValue, info): Promise<Array<SupplierSpecialtyType>> {
	return await context.db.supplierSpecialtyType.findMany()
	}

	async findOne(source, { id }: { id: string }, context: IContextValue, info): Promise<SupplierSpecialtyType> {
		return await context.db.supplierSpecialtyType.findUnique({
			where: { id }
		})
	}

	async create(source, { data }: { data: { name: string } }, context: IContextValue, info) {
		return await context.db.supplierSpecialtyType.create({
			data
		})
	}
	
}
export default SupplierSpecialtyTypeResolver