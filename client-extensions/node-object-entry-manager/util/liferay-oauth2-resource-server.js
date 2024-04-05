/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import cors from 'cors';
import {verify} from 'jsonwebtoken';
import jwktopem from 'jwk-to-pem';
import fetch from 'node-fetch';

const domains = "127.0.0.1:8080";
const externalReferenceCode = "liferay-node-oem-oauth-application-user-agent";
const lxcDXPMainDomain = "127.0.0.1:8080";
const lxcDXPServerProtocol = "http";

const uriPath =	'/o/oauth2/jwks';

const oauth2JWKSURI = `${lxcDXPServerProtocol}://${lxcDXPMainDomain}${uriPath}`;

const allowList = domains
	.split(',')
	.map((domain) => `${lxcDXPServerProtocol}://${domain}`);

const corsOptions = {
	origin(origin, callback) {
		callback(null, allowList.includes(origin));
	},
};

export async function corsWithReady(req, res, next) {
	if (req.originalUrl === "/ready") {
		return next();
	}

	return cors(corsOptions)(req, res, next);
}

export async function liferayJWT(req, res, next) {
	if (req.path === "/ready") {
		return next();
	}
	const authorization = req.headers.authorization;
	if (!authorization) {
		console.log("No authorization header");
		res.status(401).send('No authorization header');

		return;
	}

	const [, bearerToken] = req.headers.authorization.split('Bearer ');

	try {
		const jwksResponse = await fetch(oauth2JWKSURI);

		if (jwksResponse.status === 200) {
			const jwks = await jwksResponse.json();

			const jwksPublicKey = jwktopem(jwks.keys[0]);

			const decoded = verify(bearerToken, jwksPublicKey, {
				algorithms: ['RS256'],
				ignoreExpiration: true, // TODO we need to use refresh token
			});

			const applicationResponse = await fetch(
				`${lxcDXPServerProtocol}://${lxcDXPMainDomain}/o/oauth2/application?externalReferenceCode=${externalReferenceCode}`
			);

			const {client_id} = await applicationResponse.json();

			if (decoded.client_id === client_id) {
				req.jwt = decoded;

				next();
			}
			else {
				console.log('JWT token client_id value does not match expected client_id value.');
				console.log(
					'JWT token client_id value does not match expected client_id value.'
				);

				res.status(401).send('Invalid authorization');
			}
		}
		else {
			console.error('Error fetching JWKS')
			console.error(
				'Error fetching JWKS %s %s',
				jwksResponse.status,
				jwksResponse.statusText
			);

			res.status(401).send('Invalid authorization header');
		}
	}
	catch (error) {
		console.error('Error validating JWT token\n%s', error);

		res.status(401).send('Invalid authorization header');
	}
}