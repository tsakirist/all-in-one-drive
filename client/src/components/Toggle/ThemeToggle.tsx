import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/types';
import { SvgNames, createSvg } from '../../shared/utils/svg-utils';
import { Toggle } from './Toggle';
import { toggleTheme } from '../../redux/slices/settingsSlice';
import { styled } from 'styled-components';

const SvgContainer = styled.div`
	display: flex;
	height: 100%;
	justify-content: space-evenly;
	align-items: center;
	border-radius: inherit;
`;

export const ThemeToggle = () => {
	const dispatch = useDispatch();
	const themeMode = useSelector((state: RootState) => state.settings.themeMode);

	return (
		<Toggle
			checked={themeMode === 'dark'}
			onChange={() => {
				dispatch(toggleTheme());
			}}
		>
			<SvgContainer>
				{createSvg(SvgNames.Moon, 12, 'white')}
				{createSvg(SvgNames.Sun, 13, 'black')}
			</SvgContainer>
		</Toggle>
	);
};