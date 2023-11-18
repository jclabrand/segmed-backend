import { T_Beneficiario } from '@prisma/client';

import { IContextValue } from '../../../main/types'

class BeneficiariesResolver{
	
	async index(source, args, context: IContextValue, info): Promise<Array<T_Beneficiario>> {
	return await context.db.t_Beneficiario.findMany({
		where: {
			OR: [{activo:1},{activo:0}]
		}
	})
	}

	async findOne(source, { codigo }: { codigo: string }, context: IContextValue, info): Promise<T_Beneficiario> {
		return await context.db.t_Beneficiario.findUnique({
			where: { codigo }
		})
	}
	
}
export default BeneficiariesResolver