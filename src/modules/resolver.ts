
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

 import path from 'path'

 import { makeExecutableSchema } from '@graphql-tools/schema'
 import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
 import { loadFilesSync } from '@graphql-tools/load-files'
 import { IResolvers } from '@graphql-tools/utils'
 import { GraphQLSchema, DocumentNode } from 'graphql'
 
 import UserResolver from './account/user-resolver'
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
 
	 buildResolvers<TSource, TContext>(): IResolvers<TSource, TContext> {
		 const user = new UserResolver()
 
		 return mergeResolvers([
			 {
				 Query: {
					 users: user.index,
					 user: user.user
				 }
			 }
		 ])
	 }
 
	 async buildContext({ req }) : Promise<IContextValue> {
		 return {}
	 }
 }
 
 export default Resolver
 