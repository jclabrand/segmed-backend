
import { getDate, getMonth, getYear, format } from 'date-fns'

export function now(extended = true) {
	const d = new Date()

	if (extended) return {
		day: getDate(d),
		month: getMonth(d),
		year: getYear(d),
		formated: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
		utc: new Date(d.getTime() - d.getTimezoneOffset() * 60000)
	}
	else return {
		day: getDate(d),
		month: getMonth(d),
		year: getYear(d),
		formated: format(d, 'dd/MM/yyyy'),
		utc: new Date(d.getTime() - d.getTimezoneOffset() * 60000)
	}
}
