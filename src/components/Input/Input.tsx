import "./Input.css";

export const Input = (props: any) => {
	return (
		<div className="input-field-div">
			<label className="input-label">{props.title}</label>
			<input
				className={
					props.outlineStyle === "login"
						? "input-field-container__login"
						: "input-field-container__rename"
				}
				value={props.value}
				onChange={props.onChange}
				type={props.type}
			/>
		</div>
	);
};
