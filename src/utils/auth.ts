
/*	Copyright (C) 2023, All Rights Reserved
 *	Written by Juan Carlos Labrandero <jcharly@labrandero.com>
 */

import crypto from 'crypto'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


class Auth {

	static async hash(text: string): Promise<string> {
		return bcrypt.hash(text, 12)
	}

	static async compare(a: string, b: string): Promise<boolean> {
		return bcrypt.compare(a, b)
	}

	static rsa(): { publicKey: string, privateKey: string } {
		return crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem'
			}
		})
	}

	static sign<TPayload>(payload: TPayload, privateKey: string): Promise<string> {
		const cert = privateKey
			, algorithm = 'RS256'
			, expiresIn = '16d'

		return new Promise((resolve, reject) => {
			jwt.sign(payload, cert, { algorithm, expiresIn }, (err, token) => {
				if (err) reject(err)
				else resolve(token)
			})
		})
	}

	static verify<TPayload>(token: string, publicKey: string): Promise<TPayload> {
		let cert = publicKey,
			alg = 'RS256'

		return new Promise((resolve, reject) => {
			jwt.verify(token, cert, { algorithms: [alg] }, (err, payload: TPayload) => {
				if (err) reject(err)
				else resolve(payload)
			})
		})
	}
}

export default Auth
