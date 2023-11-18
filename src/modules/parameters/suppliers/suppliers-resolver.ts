import { Supplier } from '@prisma/client';

import { IContextValue } from '../../../main/types'

interface ISupplierArgs {
	code: string,
	nit: string,
	description: string,
	serviceTypeId: string
}
class SupplierResolver{
	
	async index(source, args, context: IContextValue, info): Promise<Array<Supplier>> {
	return await context.db.supplier.findMany({
		where: {
			OR: [{status:1},{status:0}]
		}
	})
	}

	async findOne(source, { id }: { id: string }, context: IContextValue, info): Promise<Supplier> {
		return await context.db.supplier.findUnique({
			where: { id }
		})
	}
	async create(source, { data }: { data: ISupplierArgs }, context: IContextValue, info) {
		console.log(data)
		return await context.db.supplier.create({
			data: {
				code: data.code,
				nit: data.nit,
				description: data.description,
				serviceTypeId: data.serviceTypeId

			}
		})
	}

	async update(source, { code, data }: { code: string, data: { nit: string, description: string, serviceTypeId: string } }, context: IContextValue, info) {
		// nostrar los datos que llegan console.log(data)
		console.log(data)
		return await context.db.supplier.update({
			where: { code },
			data: {
				nit: data.nit,
				description: data.description,
				serviceTypeId: data.serviceTypeId

			}
		})
	}

	async delete(source, { code }: { code: string }, context: IContextValue, info) {
		return await context.db.supplier.update({
			where: {code},
			data: {
				status: -1
			}

			//1 activo
			//0 inactivo
			//-1 eliminado
		})
	}


}
export default SupplierResolver