import {
	deleteDriveProperties,
	getAllDrives,
	getEncryptedTokenAsString,
	saveDriveProperties,
} from '../../../services/database/mongodb.service';
import DriveContext from '../../../services/drive/DriveContext';
import {
	encrypt,
	getDecryptedTokenFromEncryptedTokenString,
} from '../../../services/encryption/encryption.service';
import { DriveEntity, DriveQuota, DriveType, Nullable } from '../../../types/global.types';
import { getDriveContextAndToken, getDriveStrategyFromString } from './drives.helpers';

export const getAuthLink = (drive: string): string | undefined => {
	const ctxAndToken = getDriveContextAndToken(drive);
	if (ctxAndToken) {
		const { ctx } = ctxAndToken;
		const authLink = ctx.getAuthLink();
		return authLink;
	}
};

export const generateAndSaveOAuth2Token = async (
	authCode: string,
	drive: DriveType,
	userEmail: string
): Promise<boolean> => {
	const ctxAndToken = getDriveContextAndToken(drive);

	if (ctxAndToken) {
		const { ctx } = ctxAndToken;
		const tokenData = await ctx.generateOAuth2token(authCode);

		if (tokenData) {
			const encryptedTokenData = encrypt(tokenData);
			const driveEmail = await ctx.getUserDriveEmail(tokenData);
			const success = await saveDriveProperties(
				encryptedTokenData,
				driveEmail,
				userEmail,
				drive
			);

			return success;
		}
	}

	return false;
};

export const getDriveQuota = async (
	userEmail: string,
	driveEmail: string,
	drive: DriveType
): Promise<Nullable<DriveQuota>> => {
	const driveStrategy = getDriveStrategyFromString(drive);

	if (driveStrategy) {
		const ctx = new DriveContext(driveStrategy);
		const encryptedTokenStr = await getEncryptedTokenAsString(userEmail, driveEmail, drive);

		if (encryptedTokenStr) {
			const token = getDecryptedTokenFromEncryptedTokenString(encryptedTokenStr);
			const quota = ctx.getDriveQuota(token);
			return quota;
		}
	}
	return null;
};

export const getDriveEntities = async (userEmail: string): Promise<Nullable<DriveEntity[]>> => {
	const driveProperties = await getAllDrives(userEmail);

	if (driveProperties) {
		const driveEntities: DriveEntity[] = [];
		const promiseArr: Promise<Nullable<DriveQuota>>[] = [];

		try {
			driveProperties.forEach(async properties => {
				const { token: encryptedTokenStr, driveType } = properties;
				const ctxAndToken = getDriveContextAndToken(driveType, encryptedTokenStr);
				if (ctxAndToken) {
					const { ctx, token } = ctxAndToken;
					promiseArr.push(ctx.getDriveQuota(token));
				}
			});

			const quotas = await Promise.all(promiseArr);

			quotas.forEach((quota, index) => {
				const { email, driveType } = driveProperties[index];

				if (quota) {
					driveEntities.push({
						email,
						type: driveType,
						quota,
					});
				}
			});

			return driveEntities;
		} catch {
			return null;
		}
	}

	return null;
};

export const deleteDriveEntity = (
	userEmail: string,
	driveEmail: string,
	drive: DriveType
): Promise<Nullable<boolean>> => {
	return deleteDriveProperties(userEmail, driveEmail, drive);
};
