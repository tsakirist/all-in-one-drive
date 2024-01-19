import User, { DriveSchema } from '../../models/user.model';
import { DriveType, Nullable } from '../../types/global.types';

export const saveDriveProperties = async (
	encryptedTokenData: string,
	driveEmail: string,
	userEmail: string,
	drive: DriveType
): Promise<boolean> => {
	try {
		const driveProperties: DriveSchema = {
			email: driveEmail,
			token: encryptedTokenData,
			driveType: drive,
		};

		const updatedUser = await User.findOneAndUpdate(
			{ email: userEmail },
			{
				$set: { drives: driveProperties },
			},
			{ upsert: true, new: true }
		).exec();

		return !!updatedUser;
	} catch (e) {
		return false;
	}
};

export const getEncryptedTokenAsString = async (
	userEmail: string,
	driveEmail: string,
	drive: DriveType
): Promise<Nullable<string>> => {
	try {
		const user = await User.findOne({ email: userEmail }).exec();
		const driveProperties: DriveSchema[] | undefined = user?.drives;

		if (user && driveProperties) {
			const tokenData = driveProperties.find(
				properties => properties.email === driveEmail && properties.driveType === drive
			);
			return tokenData?.token ?? null;
		}
		return null;
	} catch {
		return null;
	}
};

export const getDriveProperties = async (userEmail: string): Promise<Nullable<DriveSchema[]>> => {
	try {
		const user = await User.findOne({ email: userEmail }).exec();
		return user ? user.drives : null;
	} catch {
		return null;
	}
};

export const deleteDriveProperties = async (
	userEmail: string,
	driveEmail: string,
	drive: DriveType
) => {
	try {
		const updatedUser = await User.updateOne(
			{ email: userEmail },
			{ $pull: { [drive]: { email: driveEmail } } },
			{ new: true }
		).exec();

		return !!updatedUser;
	} catch {
		return null;
	}
};
