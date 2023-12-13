
import { now } from '.'
import { Estado } from '../constants/estado.constant'

export function auditoryParamsForCreate(user) {
	const utc = now().utc

	return {
		creatorUserName: user.userName,
		creationDate: utc
	}
}

export function auditoryParamsForUpdate(user) {
	const utc = now().utc

	return {
		lastUpdateUserName: user.userName,
		lastUpdateDate: utc
	}
}

export function auditoryParamsForDelete(user) {
	const utc = now().utc

	return {
		status: Estado.Eliminado,
		deletionUserName: user.userName,
		deletionDate: utc
	}
}
