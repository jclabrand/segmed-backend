
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import path from 'path'

import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { IResolvers, mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { GraphQLSchema, DocumentNode } from 'graphql'
import { PubSub } from 'graphql-subscriptions'

import AuthResolver from '../modules/account/auth/auth-resolver'
import UserResolver from '../modules/account/user/user-resolver'
import { IContextValue, SubscriptionEvents } from './types'

import SupplierServiceTypeResolver from '../modules/parameters/suppliers/supplier-service-type.resolver'
import SupplierSpecialtyTypeResolver from '../modules/parameters/suppliers/supplier-specialty-type.resolver'
//import SupplierRelevance from '../modules/parameters/suppliers/supplier-relevance.resolver'

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

			, supplierServiceType = new SupplierServiceTypeResolver()

			, supplierSpecialtyType = new SupplierSpecialtyTypeResolver()

		return mergeResolvers([
			{
				Query: {
					users: user.index,
					currentUser: user.current,

					supplierServiceTypes: supplierServiceType.index,
					supplierServiceType: supplierServiceType.findOne,

					supplierSpecialtyTypes: supplierSpecialtyType.index,
					supplierSpecialtyType: supplierSpecialtyType.findOne,

					//supplierRelevanceTypes: supplierRelevanceType.index,
					//supplierRelevanceType: supplierRelevanceType.findOne
					
				},
				Mutation: {
					signIn: user.signIn,
					signOut: user.signOut,
					createUser: user.create,

					createSupplierServiceType: supplierServiceType.create,
					updateSupplierServiceType: supplierServiceType.update,

					createSupplierSpecialtyType: supplierSpecialtyType.create,
					createSupplierRelevanceType: supplierServiceType.create					
				},
				Subscription: {
					userAdded: {
						subscribe: () => pubsub.asyncIterator(SubscriptionEvents.USER_ADDED)
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
 