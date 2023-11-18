
import { PrismaClient } from '@prisma/client'
import Auth from '../../utils/auth'


const data = [
	{
		user: {
			userName: 'admin',
			displayName: 'Administrador',
			email: 'admin@company.com'
		},
		
		password: 'company'
	}
]

async function account() {
	console.log('...seeding data')

	const client: PrismaClient = new PrismaClient()
	try {
		for (const seed of data) {
			await client.user.create({
				data: {
					...seed.user,
					passwords: {
						create: [{ encrypted: await Auth.hash(seed.password) }]
					}
				}
			})
		}
		console.log('seeding succes!')
	} catch (error) {
		console.log(error)
	}
}

account()
