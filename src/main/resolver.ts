
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import path from 'path'

import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema, DocumentNode } from 'graphql'

import UserResolver from '../modules/account/user/user-resolver'
import { IContextValue } from './types'

class Resolver {

	schema : GraphQLSchema

	constructor() {
		this.schema = makeExecutableSchema({
			typeDefs: this.buildTypeDefs(),
			resolvers: this.buildResolvers()
		})
	}

	buildTypeDefs(): DocumentNode {
		let typesArray = loadFilesSync(path.join(__dirname, '../api'), { recursive: true })
		return mergeTypeDefs(typesArray)
	}

	buildResolvers<TSource>(): IResolvers<TSource, IContextValue> {
		const user = new UserResolver()

		return mergeResolvers([
			{
				Query: {
					users: user.index
				},
				Mutation: {
					createUser: user.create
				}
			}
		])
	}

	buildContext(context: IContextValue) {
		return async (): Promise<IContextValue> => {
			return context
		}
	}
}
 
 export default Resolver
 