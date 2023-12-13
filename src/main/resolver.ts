
import path from 'path'

import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { IResolvers, mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { GraphQLSchema, DocumentNode, GraphQLScalarType } from 'graphql'
import { PubSub } from 'graphql-subscriptions'

import { SubscriptionEvents } from '../support/constants/subscription-event.constant'

import AuthResolver from '../modules/account/auth/auth-resolver'
import UserResolver from '../modules/account/user/user-resolver'
import { IContextValue } from './types'

import ServicioMedicoResolver from '../modules/catalogo/servicio-medico/servicio-medico.resolver'
import EspecialidadMedicaResolver from '../modules/catalogo/especialidad-medica/especialidad-medica.resolver'
import BeneficiarioResolver from '../modules/identidad/beneficiario/beneficiario.resolver'
import ProveedorResolver from '../modules/referencia/proveedor/proveedor.resolver'
import MedicamentoResolver from '../modules/botica/medicamento/medicamento.resolver'
import ConsultaResolver from '../modules/salud/consulta/consulta.resolver'

class Resolver {

	schema:	GraphQLSchema
	pubsub:	PubSub

	constructor() {
		this.pubsub = new PubSub()

		let basicSchema = makeExecutableSchema({
			typeDefs: this.buildTypeDefs(),
			resolvers: this.buildResolvers()
		})

		this.schema = this.buildDirectives(basicSchema)
	}

	buildDirectives(schema: GraphQLSchema): GraphQLSchema {
		const auth = new AuthResolver()

		return mapSchema(schema, {
			[MapperKind.OBJECT_FIELD]: fieldConfig => {
				const authDirective = getDirective(schema, fieldConfig, 'authorized')

				if (authDirective) {
					fieldConfig.resolve = auth.authorized(fieldConfig.resolve)
				}

				return fieldConfig
			}
		})
	}

	buildTypeDefs(): DocumentNode {
		let typesArray = loadFilesSync(path.join(__dirname, '../api'), { recursive: true })
		return mergeTypeDefs(typesArray)
	}

	buildResolvers<TSource>(): IResolvers<TSource, IContextValue> {
		const pubsub = this.pubsub
			, user = new UserResolver()

			, servicioMedico = new ServicioMedicoResolver()
			, especialidadMedica = new EspecialidadMedicaResolver()
			, beneficiario = new BeneficiarioResolver()
			, proveedor = new ProveedorResolver()
			, medicamento = new MedicamentoResolver()
			, consulta = new ConsultaResolver()

		return mergeResolvers([
			{
				DateTime: new GraphQLScalarType({
					name: 'DateTime',
					description: 'Date custom scalar type',
					parseValue: (value: number) => new Date(value),
					serialize: (value: Date) => value.getTime()
				}),
				Query: {
					users: user.index,
					currentUser: user.current,

					serviciosMedicos: servicioMedico.index,
					servicioMedico: servicioMedico.findOne,

					especialidadesMedicas: especialidadMedica.index,
					especialidadMedica: especialidadMedica.findOne,

					beneficiarios: beneficiario.index,
					beneficiario: beneficiario.findOne,

					proveedores: proveedor.index,
					proveedor: proveedor.findOne,

					medicamentos: medicamento.index,
					medicamento: medicamento.findOne,

					consultas: consulta.index,
					consulta: consulta.findOne,
				},
				Mutation: {
					signIn: user.signIn,
					signOut: user.signOut,
					createUser: user.create,				
				},
				Subscription: {
					userCreated: {
						subscribe: () => pubsub.asyncIterator(SubscriptionEvents.USER_CREATED)
					},

					supplierSpecialtyTypeCreated: {
						subscribe: () => pubsub.asyncIterator(SubscriptionEvents.SUPPLIER_SPECIALTY_TYPE_CREATED)
					},
					supplierSpecialtyTypeUpdated: {
						subscribe: () => pubsub.asyncIterator(SubscriptionEvents.SUPPLIER_SPECIALTY_TYPE_UPDATED)
					},
					supplierSpecialtyTypeDeleted: {
						subscribe: () => pubsub.asyncIterator(SubscriptionEvents.SUPPLIER_SPECIALTY_TYPE_DELETED)
					}
				}
			}
		])
	}

	buildContext(db, pubsub) {
		return async ({ req }): Promise<IContextValue> => {
			return { req, db, pubsub }
		}
	}
}
 
 export default Resolver
 