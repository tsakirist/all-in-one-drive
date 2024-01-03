import styled from 'styled-components';
import { routes } from '../shared/constants/routes';
import { useNavigate } from 'react-router-dom';

const ErrorPageBody = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`;

const ErrorElementsContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const OopsText = styled.h1`
	font-size: 50px;
	color: black;
`;

const InfoText = styled.h2`
	color: black;
`;

const ErrorCodeText = styled.h3`
	font-size: 13px;
	color: gray;
`;

const GoBackText = styled.div`
	text-decoration: underline;
	color: blue;
	cursor: pointer;
`;

export const ErrorPage = (): JSX.Element => {
	const navigate = useNavigate();

	const redirectToHome = () => {
		navigate(routes.home);
	};

	return (
		<ErrorPageBody>
			<ErrorElementsContainer>
				<OopsText>Ooops!</OopsText>
				<InfoText>Seems that this page doesn't exist...</InfoText>
				<ErrorCodeText>(Error Code: 404)</ErrorCodeText>
				<GoBackText onClick={redirectToHome}>Go back </GoBackText>
			</ErrorElementsContainer>
		</ErrorPageBody>
	);
};
