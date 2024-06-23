import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Border(props: any) {
    return (
        <Svg
            width={430}
            height={932}
            viewBox="0 0 430 932"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M430 0H0v932h430V0zM215 647c98.307 0 178-115.51 178-258s-79.693-258-178-258S37 246.51 37 389s79.693 258 178 258z"
                fill="#fff"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M215 659c102.725 0 186-120.659 186-269.5S317.725 120 215 120 29 240.659 29 389.5 112.275 659 215 659zm0-12c98.307 0 178-115.51 178-258s-79.693-258-178-258S37 246.51 37 389s79.693 258 178 258z"
                fill={props.error ? "#F04242" : "#5DEA6B"}
            />
        </Svg>
    )
}

export default Border
