import { styled } from "styled-components";
import { FileType } from "../Shared/types/types";

const ElementContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05), 0 3px 6px rgba(0, 0, 0, 0.05);
`;

const FileElementContainer = styled(ElementContainer)`
	height: 40px;
	width: 32px;
	min-width: 32px;
	border: 1px solid lightgray;
	border-radius: 10%;
	background-color: white;
`;

const FolderElementContainer = styled(ElementContainer)`
	z-index: -1;
	position: relative;
	height: 30px;
	width: 40px;
	min-width: 40px;
	background-color: darkgray;
	border-radius: 0 4px 4px 4px;

	&:before {
		position: absolute;
		content: "";
		width: 20px;
		min-width: 20px;
		height: 5px;
		border-radius: 20px 20px 0 0;
		background-color: darkgray;
		top: -5px;
		left: 0px;
	}
`;

const ExtensionText = styled.div`
	font-size: 11px;
	max-width: 30px;
	overflow-wrap: break-word;
`;

interface IProps {
	extension?: string;
	type: FileType;
}

export const FileElement = ({ extension = "", type }: IProps): JSX.Element => {
	return type === FileType.Folder ? (
		<FolderElementContainer />
	) : (
		<FileElementContainer>
			<ExtensionText className="extension-text">
				{extension}
			</ExtensionText>
		</FileElementContainer>
	);
};