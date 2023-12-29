import { OAuth2Client } from 'googleapis-common';
import { IDriveStrategy } from './IDriveStrategy';
import { drive, auth, drive_v3 } from '@googleapis/drive';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

export default class GoogleDriveStrategy implements IDriveStrategy {
	private drive: drive_v3.Drive;
	private oAuth2Client: OAuth2Client;

	constructor() {
		const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS!);
		const { client_secret, client_id, redirect_uris } = credentials.installed;

		this.oAuth2Client = new auth.OAuth2(client_id, client_secret, redirect_uris[0]);
		this.drive = drive({ version: 'v3', auth: this.oAuth2Client });
	}

	public getAuthLink(): string {
		return this.oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});
	}

	public async generateOAuth2token(authCode: string): Promise<string> {
		try {
			const tokenData = (await this.oAuth2Client.getToken(authCode)).tokens;

			return JSON.stringify(tokenData);
		} catch (err) {
			return '';
		}
	}

	public async getUserDriveEmail(tokenStr: string): Promise<string> {
		try {
			this.setToken(tokenStr);
			const res = await this.drive.about.get({ fields: 'user' });
			const email = res.data.user?.emailAddress;

			return email ?? '';
		} catch (err) {
			return '';
		}
	}

	private setToken(tokenStr: string) {
		const token = JSON.parse(tokenStr);
		this.oAuth2Client.setCredentials(token);
	}
}
