
import { now } from '.';
import { Status } from '../constants/status.constant'

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
		status: Status.Delete,
		deletionUserName: user.userName,
		deletionDate: utc
	}
}
