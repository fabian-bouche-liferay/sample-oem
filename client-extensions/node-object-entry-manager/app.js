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

import express from 'express';

import {corsWithReady, liferayJWT} from './util/liferay-oauth2-resource-server.js';
import book  from './externalObjects/book.js';

const serverPort = 5001;
const app = express();

app.use(express.json());
app.use(corsWithReady);
app.use(liferayJWT);
app.get("/ready", (req, res) => {
	res.send('READY');
});
app.use('/book', book);
app.listen(serverPort, () => {
	console.log(`App listening on ${serverPort}`);
});

export default app;