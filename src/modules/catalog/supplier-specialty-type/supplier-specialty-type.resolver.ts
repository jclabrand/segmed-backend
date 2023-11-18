
import { SupplierSpecialtyType } from '@prisma/client'

import { Status } from '../../../support/constants/status.constant'
import { auditoryParamsForCreate, auditoryParamsForUpdate, auditoryParamsForDelete } from '../../../support/utils'
import { IContextValue } from '../../../main/types'
import { SubscriptionEvents } from '../../../support/constants/subscription-event.constant'


type SupplierSpecialtyTypeCreateArgs = {
	data: {
		name: string
	}
}

type SupplierSpecialtyTypeUpdateArgs = {
	id: number
	data: {
		name?: string
	}
}

type SupplierSpecialtyTypeDeleteArgs = {
	id: number
}

export class SupplierSpecialtyTypeResolver {
	async findAll(_, __, context: IContextValue): Promise<Array<SupplierSpecialtyType>> {
		return await context.db.supplierSpecialtyType.findMany({
			where: {
				NOT: {
					status: Status.Delete
				}
			}
		})
	}

	async findOne(_, { id }: { id: number }, context: IContextValue): Promise<SupplierSpecialtyType> {
		return await context.db.supplierSpecialtyType.findUnique({
			where: {
				id,
				NOT: {
					status: Status.Delete
				}
			}
		})
	}

	async create(_, { data }: SupplierSpecialtyTypeCreateArgs, context: IContextValue) {
		const supplierSpecialtyType = await context.db.supplierSpecialtyType.create({
			data: {
				...data,
				...auditoryParamsForCreate(context.user)
			}
		})
		context.pubsub.publish(
			SubscriptionEvents.SUPPLIER_SPECIALTY_TYPE_CREATED,
			{ supplierSpecialtyTypeCreated: supplierSpecialtyType }
		)
		return supplierSpecialtyType
	}

	async update(_, { id, data }: SupplierSpecialtyTypeUpdateArgs, context: IContextValue) {
		const supplierSpecialtyType = await context.db.supplierSpecialtyType.update({
			where: { id },
			data: {
				...data,
				...auditoryParamsForUpdate(context.user)
			}
		})
		context.pubsub.publish(
			SubscriptionEvents.SUPPLIER_SPECIALTY_TYPE_UPDATED,
			{ supplierSpecialtyTypeUpdated: supplierSpecialtyType }
		)
		return supplierSpecialtyType
	}

	async delete(_, { id }: SupplierSpecialtyTypeDeleteArgs, context: IContextValue) {
		const supplierSpecialtyType = await context.db.supplierSpecialtyType.update({
			where: { id },
			data: {
				...auditoryParamsForDelete(context.user)
			}
		})
		context.pubsub.publish(
			SubscriptionEvents.SUPPLIER_SPECIALTY_TYPE_UPDATED,
			{ supplierSpecialtyTypeUpdated: supplierSpecialtyType }
		)
		context.pubsub.publish(
			SubscriptionEvents.SUPPLIER_SPECIALTY_TYPE_DELETED,
			{ supplierSpecialtyTypeDeleted: supplierSpecialtyType }
		)
		return supplierSpecialtyType
	}
}
